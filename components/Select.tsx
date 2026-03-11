import { Portal } from "@ark-ui/react/portal";
import { Select as ArkSelect, createListCollection } from "@ark-ui/react/select";
import { ChevronsUpDownIcon, XIcon } from "lucide-react";

const frameworks = createListCollection({
  items: [
    { label: "React", value: "react" },
    { label: "Solid", value: "solid" },
    { label: "Vue", value: "vue" },
    { label: "Svelte", value: "svelte" },
  ],
});

export const Select = () => {
  return (
    <ArkSelect.Root collection={frameworks}>
      <ArkSelect.Label >Framework</ArkSelect.Label>
      <ArkSelect.Control >
        <ArkSelect.Trigger >
          <ArkSelect.ValueText placeholder="ArkSelect" />
        </ArkSelect.Trigger>
        <div>
          <ArkSelect.ClearTrigger >
            <XIcon />
          </ArkSelect.ClearTrigger>
          <ArkSelect.Indicator>
            <ChevronsUpDownIcon />
          </ArkSelect.Indicator>
        </div>
      </ArkSelect.Control>
      <Portal>
        <ArkSelect.Positioner>
          <ArkSelect.Content >
            <ArkSelect.ItemGroup >
              <ArkSelect.ItemGroupLabel>
                Frameworks
              </ArkSelect.ItemGroupLabel>
              {frameworks.items.map((item) => (
                <ArkSelect.Item
                  key={item.value}
                  item={item}
                >
                  <ArkSelect.ItemText>
                    {item.label}
                  </ArkSelect.ItemText>
                  <ArkSelect.ItemIndicator>
                    ✓
                  </ArkSelect.ItemIndicator>
                </ArkSelect.Item>
              ))}
            </ArkSelect.ItemGroup>
          </ArkSelect.Content>
        </ArkSelect.Positioner>
      </Portal>
      <ArkSelect.HiddenSelect />
    </ArkSelect.Root>
  );
};
