import {
  AddFolder as AddFolderIcon,
  Add as AddIcon,
  Airbuds as AirbudsIcon,
  AltArrowDown as AltArrowDownIcon,
  AltArrowLeft as AltArrowLeftIcon,
  AltArrowRight as AltArrowRightIcon,
  AltArrowUp as AltArrowUpIcon,
  Archive as ArchiveIcon,
  ArchiveUp as ArchiveUpIcon,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  ArrowRightUp as ArrowRightUpIcon,
  Backpack as BackpackIcon,
  Banknote as BanknoteIcon,
  Bell as BellIcon,
  Bill as BillIcon,
  Bluetooth as BluetoothIcon,
  Book2 as Book2Icon,
  BookBookmark as BookBookmarkIcon,
  Book as BookIcon,
  Bookmark as BookmarkIcon,
  Box as BoxIcon,
  Buildings3 as Buildings3Icon,
  Buildings as BuildingsIcon,
  CalendarDate as CalendarDateIcon,
  Calendar as CalendarIcon,
  CalendarMark as CalendarMarkIcon,
  CallDropped as CallDroppedIcon,
  Card as CardIcon,
  CartLarge as CartLargeIcon,
  Case as CaseIcon,
  Chart as ChartIcon,
  ChartSquare as ChartSquareIcon,
  ChatRoundDots as ChatRoundDotsIcon,
  CheckCircle as CheckCircleIcon,
  ClipboardList as ClipboardListIcon,
  ClockCircle as ClockCircleIcon,
  Close as CloseIcon,
  Copy as CopyIcon,
  CupStar as CupStarIcon,
  Devices as DevicesIcon,
  DocumentAdd as DocumentAddIcon,
  Document as DocumentIcon,
  DocumentText as DocumentTextIcon,
  Download as DownloadIcon,
  Dumbbell as DumbbellIcon,
  Eye as EyeIcon,
  FileText as FileTextIcon,
  Flag as FlagIcon,
  Folder as FolderIcon,
  FolderWithFiles as FolderWithFilesIcon,
  Gallery as GalleryIcon,
  Gamepad as GamepadIcon,
  Gift as GiftIcon,
  HeadphonesRound as HeadphonesRoundIcon,
  Heart as HeartIcon,
  Home as HomeIcon,
  type IconComponent,
  type IconProps,
  IncomingCall as IncomingCallIcon,
  Key as KeyIcon,
  Leaf as LeafIcon,
  Library as LibraryIcon,
  List as ListIcon,
  Magnifier as MagnifierIcon,
  MenuDots as MenuDotsIcon,
  Moon as MoonIcon,
  NotebookBookmark as NotebookBookmarkIcon,
  OutgoingCall as OutgoingCallIcon,
  Palette as PaletteIcon,
  PaletteRound as PaletteRoundIcon,
  Pen as PenIcon,
  Play as PlayIcon,
  Printer as PrinterIcon,
  QuestionCircle as QuestionCircleIcon,
  RecordCircle as RecordCircleIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Share as ShareIcon,
  ShieldCheck as ShieldCheckIcon,
  Sidebar as SidebarIcon,
  SidebarMinimalistic as SidebarMinimalisticIcon,
  SkipNext as SkipNextIcon,
  SkipPrevious as SkipPreviousIcon,
  SmileCircle as SmileCircleIcon,
  SortFromBottomToTop as SortFromBottomToTopIcon,
  SortFromTopToBottom as SortFromTopToBottomIcon,
  SortVertical as SortVerticalIcon,
  SquareAcademicCap as SquareAcademicCapIcon,
  Star as StarIcon,
  Sun2 as Sun2Icon,
  Sun as SunIcon,
  TrashBinTrash as TrashBinTrashIcon,
  Upload as UploadIcon,
  UserCheck as UserCheckIcon,
  UserCheckRounded as UserCheckRoundedIcon,
  User as UserIcon,
  UsersGroupRounded as UsersGroupRoundedIcon,
  VerifiedCheck as VerifiedCheckIcon,
  Videocamera as VideocameraIcon,
  VolumeLoud as VolumeLoudIcon,
  Wallet as WalletIcon,
  WiFi as WiFiIcon,
  Widget2 as Widget2Icon,
  Widget as WidgetIcon
} from '@vezham/icons-react'

const icons = {
  'vx:sort-descending': {
    component: SortFromTopToBottomIcon,
    weight: 'outline'
  },
  'vx:arrow-left': { component: ArrowLeftIcon, weight: 'outline' },
  'vx:arrow-right': { component: ArrowRightIcon, weight: 'outline' },
  'vx:sort-ascending': {
    component: SortFromBottomToTopIcon,
    weight: 'outline'
  },
  'vx:verified': { component: VerifiedCheckIcon, weight: 'outline' },
  'vx:chart': { component: ChartIcon, weight: 'outline' },
  'vx:bell': { component: BellIcon, weight: 'outline' },
  'vx:book': { component: BookIcon, weight: 'outline' },
  'vx:book-open': { component: Book2Icon, weight: 'outline' },
  'vx:briefcase': { component: CaseIcon, weight: 'outline' },
  'vx:calendar-check': { component: CalendarMarkIcon, weight: 'outline' },
  'vx:calendar-clock': { component: CalendarDateIcon, weight: 'outline' },
  'vx:calendar-days': { component: CalendarDateIcon, weight: 'outline' },
  'vx:calendar-minus': { component: CalendarIcon, weight: 'outline' },
  'vx:check': { component: CheckCircleIcon, weight: 'filled' },
  'vx:chevron-down': { component: AltArrowDownIcon, weight: 'outline' },
  'vx:chevron-left': { component: AltArrowLeftIcon, weight: 'outline' },
  'vx:chevron-right': { component: AltArrowRightIcon, weight: 'outline' },
  'vx:chevron-up': { component: AltArrowUpIcon, weight: 'outline' },
  'vx:chevrons-up-down': { component: SortVerticalIcon, weight: 'outline' },
  'vx:status': { component: RecordCircleIcon, weight: 'outline' },
  'vx:help': { component: QuestionCircleIcon, weight: 'outline' },
  'vx:clipboard-list': { component: ClipboardListIcon, weight: 'outline' },
  'vx:clock': { component: ClockCircleIcon, weight: 'outline' },
  'vx:clock-3': { component: ClockCircleIcon, weight: 'outline' },
  'vx:download': { component: DownloadIcon, weight: 'outline' },
  'vx:dumbbell': { component: DumbbellIcon, weight: 'outline' },
  'vx:eye': { component: EyeIcon, weight: 'outline' },
  'vx:report': { component: ChartSquareIcon, weight: 'outline' },
  'vx:document-edit': { component: DocumentAddIcon, weight: 'outline' },
  'vx:file-spreadsheet': { component: DocumentTextIcon, weight: 'outline' },
  'vx:file-text': { component: FileTextIcon, weight: 'outline' },
  'vx:academic-cap': {
    component: SquareAcademicCapIcon,
    weight: 'outline'
  },
  'vx:home': { component: HomeIcon, weight: 'outline' },
  'vx:grid': { component: WidgetIcon, weight: 'outline' },
  'vx:library': { component: LibraryIcon, weight: 'outline' },
  'vx:list': { component: ListIcon, weight: 'outline' },
  'vx:menu-horizontal': { component: MenuDotsIcon, weight: 'outline' },
  'vx:menu-vertical': {
    component: MenuDotsIcon,
    weight: 'outline',
    rotate: 90
  },
  'vx:box': { component: BoxIcon, weight: 'outline' },
  'vx:panel-left-close': {
    component: SidebarMinimalisticIcon,
    weight: 'outline'
  },
  'vx:panel-left-open': {
    component: SidebarMinimalisticIcon,
    weight: 'outline'
  },
  'vx:pencil': { component: PenIcon, weight: 'outline' },
  'vx:phone-incoming': { component: IncomingCallIcon, weight: 'outline' },
  'vx:phone-missed': { component: CallDroppedIcon, weight: 'outline' },
  'vx:phone-outgoing': { component: OutgoingCallIcon, weight: 'outline' },
  'vx:plus': { component: AddIcon, weight: 'outline' },
  'vx:printer': { component: PrinterIcon, weight: 'outline' },
  'vx:receipt': { component: BillIcon, weight: 'outline' },
  'vx:refresh': { component: RefreshIcon, weight: 'outline' },
  'vx:school': { component: BuildingsIcon, weight: 'outline' },
  'vx:search': { component: MagnifierIcon, weight: 'outline' },
  'vx:settings': { component: SettingsIcon, weight: 'outline' },
  'vx:sidebar': {
    component: SidebarIcon,
    weight: 'outline'
  },
  'vx:trash': { component: TrashBinTrashIcon, weight: 'outline' },
  'vx:upload': { component: UploadIcon, weight: 'outline' },
  'vx:user': { component: UserIcon, weight: 'outline' },
  'vx:user-check': { component: UserCheckIcon, weight: 'outline' },
  'vx:user-round-check': {
    component: UserCheckRoundedIcon,
    weight: 'outline'
  },
  'vx:users': { component: UsersGroupRoundedIcon, weight: 'outline' },
  'vx:wallet': { component: WalletIcon, weight: 'outline' },
  'vx:close': { component: CloseIcon, weight: 'outline' },
  'vx:skip-next': { component: SkipNextIcon, weight: 'filled' },
  'vx:skip-previous': { component: SkipPreviousIcon, weight: 'filled' },
  'vx:wifi': { component: WiFiIcon, weight: 'filled' },
  'vx:airbuds-filled': { component: AirbudsIcon, weight: 'filled' },
  'vx:archive-filled': { component: ArchiveIcon, weight: 'filled' },
  'vx:archive': { component: ArchiveIcon, weight: 'outline' },
  'vx:archive-up': { component: ArchiveUpIcon, weight: 'outline' },
  'vx:external-link': {
    component: ArrowRightUpIcon,
    weight: 'outline'
  },
  'vx:backpack-filled': { component: BackpackIcon, weight: 'filled' },
  'vx:banknote-filled': { component: BanknoteIcon, weight: 'filled' },
  'vx:bluetooth-filled': { component: BluetoothIcon, weight: 'filled' },
  'vx:book-bookmark-filled': { component: BookBookmarkIcon, weight: 'filled' },
  'vx:bookmark-filled': { component: BookmarkIcon, weight: 'filled' },
  'vx:box-filled': { component: BoxIcon, weight: 'filled' },
  'vx:buildings-3-filled': { component: Buildings3Icon, weight: 'filled' },
  'vx:card-filled': { component: CardIcon, weight: 'filled' },
  'vx:card': { component: CardIcon, weight: 'outline' },
  'vx:cart-large-filled': { component: CartLargeIcon, weight: 'filled' },
  'vx:chart-filled': { component: ChartIcon, weight: 'filled' },
  'vx:chat-round-dots': {
    component: ChatRoundDotsIcon,
    weight: 'outline'
  },
  'vx:copy-filled': { component: CopyIcon, weight: 'filled' },
  'vx:cup-star-filled': { component: CupStarIcon, weight: 'filled' },
  'vx:devices': { component: DevicesIcon, weight: 'outline' },
  'vx:document-filled': { component: DocumentIcon, weight: 'filled' },
  'vx:document': { component: DocumentIcon, weight: 'outline' },
  'vx:flag-filled': { component: FlagIcon, weight: 'filled' },
  'vx:folder-filled': { component: FolderIcon, weight: 'filled' },
  'vx:folder-add': { component: AddFolderIcon, weight: 'outline' },
  'vx:folder-with-files': {
    component: FolderWithFilesIcon,
    weight: 'outline'
  },
  'vx:gallery': { component: GalleryIcon, weight: 'outline' },
  'vx:gamepad-filled': { component: GamepadIcon, weight: 'filled' },
  'vx:gift-filled': { component: GiftIcon, weight: 'filled' },
  'vx:headphones-round-filled': {
    component: HeadphonesRoundIcon,
    weight: 'filled'
  },
  'vx:heart-filled': { component: HeartIcon, weight: 'filled' },
  'vx:home-filled': { component: HomeIcon, weight: 'filled' },
  'vx:key-filled': { component: KeyIcon, weight: 'filled' },
  'vx:leaf-filled': { component: LeafIcon, weight: 'filled' },
  'vx:library-filled': { component: LibraryIcon, weight: 'filled' },
  'vx:list-filled': { component: ListIcon, weight: 'filled' },
  'vx:moon-filled': { component: MoonIcon, weight: 'filled' },
  'vx:notebook-bookmark-filled': {
    component: NotebookBookmarkIcon,
    weight: 'filled'
  },
  'vx:palette': { component: PaletteIcon, weight: 'outline' },
  'vx:palette-filled': { component: PaletteIcon, weight: 'filled' },
  'vx:palette-round': {
    component: PaletteRoundIcon,
    weight: 'outline'
  },
  'vx:pen': { component: PenIcon, weight: 'outline' },
  'vx:play-filled': { component: PlayIcon, weight: 'filled' },
  'vx:settings-filled': { component: SettingsIcon, weight: 'filled' },
  'vx:share': { component: ShareIcon, weight: 'outline' },
  'vx:shield-check': {
    component: ShieldCheckIcon,
    weight: 'outline'
  },
  'vx:smile-circle': {
    component: SmileCircleIcon,
    weight: 'outline'
  },
  'vx:academic-cap-filled': {
    component: SquareAcademicCapIcon,
    weight: 'filled'
  },
  'vx:star-filled': { component: StarIcon, weight: 'filled' },
  'vx:star': { component: StarIcon, weight: 'outline' },
  'vx:sun-2-filled': { component: Sun2Icon, weight: 'filled' },
  'vx:sun-filled': { component: SunIcon, weight: 'filled' },
  'vx:users-filled': {
    component: UsersGroupRoundedIcon,
    weight: 'filled'
  },
  'vx:videocamera': { component: VideocameraIcon, weight: 'outline' },
  'vx:volume-loud-filled': { component: VolumeLoudIcon, weight: 'filled' },
  'vx:wallet-filled': { component: WalletIcon, weight: 'filled' },
  'vx:widget-2-filled': { component: Widget2Icon, weight: 'filled' }
} satisfies Record<
  string,
  { component: IconComponent; weight: IconProps['weight']; rotate?: number }
>

type AppIconName = keyof typeof icons
type Props = IconProps & { icon?: string }

export const AppIcon = ({
  icon,
  size,
  width,
  height,
  style,
  ...props
}: Props) => {
  if (!icon) return null

  if (!Object.prototype.hasOwnProperty.call(icons, icon)) return null

  const entry = icons[icon as AppIconName]
  const Component = entry.component
  return (
    <Component
      size={width ?? size ?? '1em'}
      height={height ?? width ?? size ?? '1em'}
      weight={entry.weight}
      style={{
        ...('rotate' in entry
          ? { transform: `rotate(${entry.rotate}deg)` }
          : {}),
        ...style
      }}
      aria-hidden="true"
      {...props}
    />
  )
}

export type { AppIconName }
