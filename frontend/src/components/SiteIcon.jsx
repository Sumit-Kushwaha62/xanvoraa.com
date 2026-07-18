import {
  BadgeIndianRupee, BookOpen, BriefcaseBusiness, Building2, Check, ClipboardCheck,
  ClipboardList, Cloud, FileCode2, FileText, GraduationCap, Handshake, HeartHandshake,
  Home, Hospital, Hotel, Laptop, Leaf, LockKeyhole, Mail, MapPin, MessageCircle,
  Mountain, Network, Phone, Rocket, Scale, Search, ServerCog, Settings, ShieldCheck,
  ShoppingCart, Sparkles, Target, Timer, TrendingUp, Users, Waves, Zap,
} from 'lucide-react'

const icons = {
  briefcase: BriefcaseBusiness, check: Check, clipboard: ClipboardList, cloud: Cloud,
  document: FileText, ecommerce: ShoppingCart, education: GraduationCap, email: Mail,
  growth: TrendingUp, handshake: Handshake, healthcare: Hospital, home: Home,
  hospitality: Hotel, laptop: Laptop, learning: BookOpen, legal: Scale, local: MapPin,
  location: MapPin, lock: LockKeyhole, message: MessageCircle, mountain: Mountain,
  network: Network, ngo: HeartHandshake, phone: Phone, planning: ClipboardCheck,
  pricing: BadgeIndianRupee, quality: ShieldCheck, realestate: Building2, rocket: Rocket,
  search: Search, server: ServerCog, settings: Settings, speed: Zap, target: Target,
  timer: Timer, transparency: Search, waves: Waves, web: FileCode2, zen: Leaf,
  mentorship: Users, sparkles: Sparkles,
}

export default function SiteIcon({ name, size = 24, strokeWidth = 1.8, ...props }) {
  const Icon = icons[name] || Sparkles
  return <Icon aria-hidden="true" size={size} strokeWidth={strokeWidth} {...props} />
}