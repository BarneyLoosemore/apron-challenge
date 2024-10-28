import BinIcon from "../../assets/bin-icon.svg";
import PlusIcon from "../../assets/plus-icon.svg";
import UpArrowIcon from "../../assets/up-arrow-icon.svg";
import DownArrowIcon from "../../assets/down-arrow-icon.svg";
import CloseIcon from "../../assets/close-icon.svg";
import DropdownIcon from "../../assets/dropdown-icon.svg";

const iconMap = {
  bin: BinIcon,
  plus: PlusIcon,
  upArrow: UpArrowIcon,
  downArrow: DownArrowIcon,
  close: CloseIcon,
  dropdown: DropdownIcon,
} as const;

export const Icon = ({ name }: { name: keyof typeof iconMap }) => {
  const src = new URL(iconMap[name], import.meta.url).href;
  return <img src={src} alt="" role="presentation" />;
};
