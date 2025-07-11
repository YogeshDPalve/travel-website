import { Location } from "@/app/generated/prisma";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { useId, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { reorderItinerary } from "@/lib/actions/reorder-itinerary";
interface SortableItineraryProps {
  locations: Location[];
  tripId: string;
}

function SortableItem({ item }: { item: Location }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: item.id,
    });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="p-4 border rounded-md flex justify-between items-center hover:shadow cursor-grab transition-shadow"
    >
      <div>
        <h4 className="font-medium text-lg text-gray-800">
          {item.locationTitle}
        </h4>
        <p className="text-sm text-gray-500 truncate max-w-xs">
          {`Latitude: ${item.lat}, Longitude: ${item.lng}`}{" "}
        </p>
      </div>
      <div className="text-sm text-gray-600">Day {item.order + 1}</div>
    </div>
  );
}

export default function SortableItinerary({
  locations,
  tripId,
}: SortableItineraryProps) {
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id != over?.id) {
      const oldIndex = localLocation.findIndex((item) => item.id === active.id);
      const newIndex = localLocation.findIndex((item) => item.id === over!.id);

      const NewLocationsOrder = arrayMove(
        localLocation,
        oldIndex,
        newIndex
      ).map((item, index) => ({ ...item, order: index }));

      setLocalLocation(NewLocationsOrder);
      await reorderItinerary(
        tripId,
        NewLocationsOrder.map((item) => item.id)
      );
    }
  };
  const id = useId();
  const [localLocation, setLocalLocation] = useState(locations);
  return (
    <DndContext
      id={id}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={localLocation.map((loc) => loc.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4 ">
          {localLocation.map((item, key) => (
            <SortableItem key={key} item={item} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
