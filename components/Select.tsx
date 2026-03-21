import { Portal } from "@ark-ui/react/portal";
import {
  Select as ArkSelect,
  type SelectRootProps,
} from "@ark-ui/react/select";
import { ChevronsUpDownIcon } from "lucide-react";
import { PropsWithChildren } from "react";

export type SelectProps<T> = PropsWithChildren<
  SelectRootProps<T> & {
    placeholder?: string;
  }
>;

export const Select = <T,>(props: SelectProps<T>) => {
  const { placeholder, children, ...rest } = props;

  return (
    <ArkSelect.Root
      {...rest}
      className="bg-white border border-gray-200 rounded-sm w-full md:w-1/4 p-1 mb-4"
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
        </div>
      </ArkSelect.Control>
      <Portal>
        <ArkSelect.Positioner>
          <ArkSelect.Content className="bg-white border z-10 border-gray-200 w-full rounded-sm">
            {children}
          </ArkSelect.Content>
        </ArkSelect.Positioner>
      </Portal>
      <ArkSelect.HiddenSelect />
    </ArkSelect.Root>
  );
};