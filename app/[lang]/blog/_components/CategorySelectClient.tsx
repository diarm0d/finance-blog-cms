"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Select as ArkSelect } from "@ark-ui/react/select";
import { Select } from "@/components/Select";
import { CategoryDocument } from "@/prismicio-types";
import { createListCollection } from "@ark-ui/react/select";

export type CategorySelectClientProps = {
  categories: CategoryDocument<string>[];
  placeholder?: string;
  allLabel?: string;
};

type Item = { label: string; value: string };

export const CategorySelectClient = (props: CategorySelectClientProps) => {
  const { categories, placeholder, allLabel = "All" } = props;
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const categoryOptions = [
    { label: allLabel, value: "all" },
    ...categories.map((category) => ({
      label: category.data.name as string,
      value: category.uid,
    })),
  ];

  const collection = createListCollection({ items: categoryOptions });

  const handleCategoryChange = (details: { value: string[] }) => {
    const category = details.value[0];
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", category);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Select<Item>
      placeholder={placeholder}
      collection={collection}
      onValueChange={handleCategoryChange}
    >
      <ArkSelect.ItemGroup>
        {collection?.items.map((item: Item) => (
          <ArkSelect.Item
            key={item.value}
            item={item}
            className="py-2 px-4 hover:bg-gray-200"
          >
            <ArkSelect.ItemText>{item.label}</ArkSelect.ItemText>
            <ArkSelect.ItemIndicator>✓</ArkSelect.ItemIndicator>
          </ArkSelect.Item>
        ))}
      </ArkSelect.ItemGroup>
    </Select>
  );
};
