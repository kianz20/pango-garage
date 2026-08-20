import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const POSITION_LABELS = ['1st', '2nd', '3rd', '4th', '5th', '6th'];

function Row({ item, index, count, onNudge, disabled }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id, disabled });

  return (
    <li
      ref={setNodeRef}
      className={`rank-row${isDragging ? ' is-dragging' : ''}${disabled ? ' is-locked' : ''}`}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
    >
      <span className="rank-row__pos">{POSITION_LABELS[index]}</span>
      <span className="rank-row__item">
        {item.subtitle != null && <span className="rank-row__subtitle">{item.subtitle}</span>}
        <span className="rank-row__title">
          {item.title}
          {item.meta != null && <span className="rank-row__meta"> · {item.meta}</span>}
        </span>
      </span>
      <span className="rank-row__nudge">
        <button
          type="button"
          className="nudge"
          aria-label={`Move ${item.title} up`}
          disabled={disabled || index === 0}
          // Buttons live inside a draggable row, so keep the drag sensors out of it.
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          onClick={() => onNudge(index, -1)}
        >
          ▲
        </button>
        <button
          type="button"
          className="nudge"
          aria-label={`Move ${item.title} down`}
          disabled={disabled || index === count - 1}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          onClick={() => onNudge(index, 1)}
        >
          ▼
        </button>
      </span>
      <span className="rank-row__grip" aria-hidden="true">
        ⠿
      </span>
    </li>
  );
}

/**
 * The controller. Drag to reorder, or use the arrows — phones vary wildly in how well
 * they handle drag gestures, and the arrows are also the keyboard/screen-reader path.
 */
export default function RankList({ items: pool, order, onChange, disabled = false }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const byId = new Map(pool.map((it) => [it.id, it]));
  const items = order.map((id) => byId.get(id)).filter(Boolean);

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const from = order.indexOf(active.id);
    const to = order.indexOf(over.id);
    if (from < 0 || to < 0) return;
    onChange(arrayMove(order, from, to));
  };

  const nudge = (index, delta) => {
    const to = index + delta;
    if (to < 0 || to >= order.length) return;
    onChange(arrayMove(order, index, to));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={order} strategy={verticalListSortingStrategy}>
        <ol className="rank-list">
          {items.map((item, i) => (
            <Row
              key={item.id}
              item={item}
              index={i}
              count={items.length}
              onNudge={nudge}
              disabled={disabled}
            />
          ))}
        </ol>
      </SortableContext>
    </DndContext>
  );
}
