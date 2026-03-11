import { Portal } from "@ark-ui/react/portal";
import {
  Select as ArkSelect,
  type SelectRootProps,
} from "@ark-ui/react/select";
import { ChevronsUpDownIcon, XIcon } from "lucide-react";

export type SelectProps = SelectRootProps<{
  label: string;
  value: string;
}> & {
  placeholder?: string;
};

export const Select = (props: SelectProps) => {
  const { placeholder, collection, ...rest } = props;

  return (
    <ArkSelect.Root
      collection={collection}
      {...rest}
      className="bg-white border border-gray-200 rounded-sm w-1/4 p-1 mb-4"
    >
      <ArkSelect.Control className="w-full h-full">
        <div className="flex justify-between items-center">
          <ArkSelect.Trigger className="w-full flex justify-between items-center">
            <ArkSelect.ValueText
              className="ml-4 text-gray-600 text-sm"
              placeholder={placeholder}
            />
            <ArkSelect.Indicator>
              <ChevronsUpDownIcon className="text-gray-400" />
            </ArkSelect.Indicator>
          </ArkSelect.Trigger>
          <div>
            <ArkSelect.ClearTrigger>
              <XIcon />
            </ArkSelect.ClearTrigger>
          </div>
        </div>
      </ArkSelect.Control>
      <Portal>
        <ArkSelect.Positioner>
          <ArkSelect.Content className="bg-white border border-gray-200 w-[150px] rounded-sm">
            <ArkSelect.ItemGroup>
              {collection?.items.map((item) => (
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
          </ArkSelect.Content>
        </ArkSelect.Positioner>
      </Portal>
      <ArkSelect.HiddenSelect />
    </ArkSelect.Root>
  );
};
