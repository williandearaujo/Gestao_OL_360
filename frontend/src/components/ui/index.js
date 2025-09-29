// Layout Components
export { default as PageContainer } from './layouts/PageContainer';
export { default as PageHeader } from './layouts/PageHeader';
export { default as PageSection } from './layouts/PageSection';

// Card Components
export { default as StatCard } from './cards/StatCard';
export { default as ChartCard } from './cards/ChartCard';
export { default as AlertCard } from './cards/AlertCard';

// Form Components
export { default as Button } from './forms/Button';
export { default as Input } from './forms/Input';
export { default as Select } from './forms/Select';

// Feedback Components
export { default as Loading } from './feedback/Loading';
export { default as EmptyState } from './feedback/EmptyState';
export { default as StatusBadge } from './feedback/StatusBadge';

// Modal Components
export { default as Modal } from './modals/Modal';

// Re-export common icons from lucide-react for convenience
export {
  // Layout icons
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,

  // Action icons
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Settings,
  Filter,
  Search,
  RefreshCw,

  // Status icons
  Check,
  AlertCircle,
  AlertTriangle,
  Info,

  // Business icons
  Users,
  User,
  BookOpen,
  Award,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  Link,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Building,

  // File icons
  FileText,
  Download,
  Upload,
  Image,
  File
} from 'lucide-react';
