
"use client"; 
 
import Link from "next/link"; 
import { useMemo, useState, type ReactNode } from "react"; 
 
type Tab = 
  | "profile" 
  | "workspace" 
  | "ai" 
  | "notifications" 
  | "appearance" 
  | "security" 
  | "data"; 
 
type ToastType = "success" | "error" | "info"; 
 
type Toast = { 
  type: ToastType; 
  message: string; 
}; 
 
const tabs: { 
  id: Tab; 
  label: string; 
  description: string; 
}[] = [ 
  { id: "profile", label: "Profile", description: "Personal identity" }, 
  { id: "workspace", label: "Workspace", description: "Workspace control" }, 
  { id: "ai", label: "AI & Automation", description: "Intelligence behavior" }, 
  { id: "notifications", label: "Notifications", description: "Alerts & emails" }, 
  { id: "appearance", label: "Appearance", description: "Interface experience" }, 
  { id: "security", label: "Security", description: "Account protection" }, 
  { id: "data", label: "Data & Privacy", description: "Export & danger zone" }, 
]; 
 
const iconMap: Record<Tab, IconName> = { 
  profile: "user", 
  workspace: "workspace", 
  ai: "spark", 
  notifications: "bell", 
  appearance: "sun", 
  security: "lock", 
  data: "database", 
}; 
 
type IconName = 
  | "user" 
  | "workspace" 
  | "spark" 
  | "bell" 
  | "sun" 
  | "lock" 
  | "database" 
  | "arrow" 
  | "save" 
  | "download" 
  | "refresh" 
  | "logout" 
  | "trash" 
  | "check" 
  | "search" 
  | "chevron"; 
 
function Icon({ 
  name, 
  size = 18, 
}: { 
  name: IconName; 
  size?: number; 
}) { 
  const common = { 
    width: size, 
    height: size, 
    viewBox: "0 0 24 24", 
    fill: "none", 
    stroke: "currentColor", 
    strokeWidth: 1.7, 
    strokeLinecap: "round" as const, 
    strokeLinejoin: "round" as const, 
  }; 
 
  const paths: Record<IconName, ReactNode> = { 
    user: ( 
      <> 
        <circle cx="12" cy="8" r="3.5" /> 
        <path d="M5 20c.8-3.4 3.1-5.3 7-5.3s6.2 1.9 7 5.3" /> 
      </> 
    ), 
    workspace: ( 
      <> 
        <rect x="4" y="4" width="16" height="16" rx="3" /> 
        <path d="M8 8h8M8 12h5M8 16h8" /> 
      </> 
    ), 
    spark: ( 
      <> 
        <path d="m12 3 1.4 5.1L18 10l-4.6 1.9L12 17l-1.4-5.1L6 10l4.6-1.9L12 3Z" /> 
        <path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" /> 
      </> 
    ), 
    bell: ( 
      <> 
        <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /> 
        <path d="M10 21h4" /> 
      </> 
    ), 
    sun: ( 
      <> 
        <circle cx="12" cy="12" r="3.5" /> 
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /> 
      </> 
    ), 
    lock: ( 
      <> 
        <rect x="5" y="10" width="14" height="10" rx="2" /> 
        <path d="M8 10V7a4 4 0 0 1 8 0v3" /> 
      </> 
    ), 
    database: ( 
      <> 
        <ellipse cx="12" cy="5" rx="7" ry="3" /> 
        <path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5" /> 
        <path d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" /> 
      </> 
    ), 
    arrow: <path d="M19 12H5M11 6l-6 6 6 6" />, 
    save: ( 
      <> 
        <path d="M5 4h12l2 2v14H5V4Z" /> 
        <path d="M8 4v5h8V4M8 20v-6h8v6" /> 
      </> 
    ), 
    download: ( 
      <> 
        <path d="M12 3v12" /> 
        <path d="m7 10 5 5 5-5" /> 
        <path d="M5 21h14" /> 
      </> 
    ), 
    refresh: ( 
      <> 
        <path d="M20 11a8 8 0 0 0-14.8-4L4 9" /> 
        <path d="M4 4v5h5" /> 
        <path d="M4 13a8 8 0 0 0 14.8 4L20 15" /> 
        <path d="M20 20v-5h-5" /> 
      </> 
    ), 
    logout: ( 
      <> 
        <path d="M10 5H5v14h5" /> 
        <path d="M14 8l4 4-4 4" /> 
        <path d="M18 12H9" /> 
      </> 
    ), 
    trash: ( 
      <> 
        <path d="M4 7h16M10 11v6M14 11v6" /> 
        <path d="M9 7V4h6v3M6 7l1 14h10l1-14" /> 
      </> 
    ), 
    check: <path d="m5 12 4 4L19 6" />, 
    search: ( 
      <> 
        <circle cx="10.8" cy="10.8" r="6.5" /> 
        <path d="m16 16 5 5" /> 
      </> 
    ), 
    chevron: <path d="m9 6 6 6-6 6" />, 
  }; 
 
  return <svg {...common}>{paths[name]}</svg>; 
} 
 
function Toggle({ 
  enabled, 
  onChange, 
  label, 
}: { 
  enabled: boolean; 
  onChange: () => void; 
  label: string; 
}) { 
  return ( 
    <button 
      type="button" 
      role="switch" 
      aria-checked={enabled} 
      aria-label={label} 
      onClick={onChange} 
      className={`group relative h-7 w-[50px] shrink-0 rounded-full border p-[3px] transition-all duration-300 ${ 
        enabled 
          ? "border-[#e7b85c]/60 bg-[#dca947]/90 shadow-[0_0_28px_rgba(231,184,92,0.18)]" 
          : "border-white/[0.1] bg-white/[0.045]" 
      }`} 
    > 
      <span 
        className={`block h-[19px] w-[19px] rounded-full transition-all duration-300 ${ 
          enabled 
            ? "translate-x-[22px] bg-[#17130a] shadow-[0_2px_10px_rgba(0,0,0,0.45)]" 
            : "translate-x-0 bg-[#70757c]" 
        }`} 
      /> 
    </button> 
  ); 
} 
 
function SectionHeader({ 
  number, 
  eyebrow, 
  title, 
  description, 
}: { 
  number: string; 
  eyebrow: string; 
  title: string; 
  description: string; 
}) { 
  return ( 
    <div className="mb-8"> 
      <div className="mb-4 flex items-center gap-3"> 
        <span className="flex h-7 min-w-7 items-center justify-center rounded-md border border-[#e7b84b]/20 bg-[#e7b84b]/[0.055] px-2 font-mono text-[9px] font-bold tracking-wider text-[#f5d98b] shadow-[inset_0_0_18px_rgba(231,184,75,0.025)]"> 
          {number} 
        </span> 
 
        <span className="h-px w-8 bg-gradient-to-r from-[#e7b84b]/35 to-[#e7b84b]/5" /> 
 
        <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#e7b84b]"> 
          {eyebrow} 
        </p> 
      </div> 
 
      <h2 className="text-[22px] font-semibold tracking-[-0.035em] text-[#f4f0e6] drop-shadow-[0_2px_16px_rgba(0,0,0,0.2)] sm:text-[25px]"> 
        {title} 
      </h2> 
 
      <p className="mt-2 max-w-2xl text-[13px] leading-6 text-[#9a9d94]"> 
        {description} 
      </p> 
    </div> 
  ); 
} 
 
function SettingRow({ 
  title, 
  description, 
  children, 
}: { 
  title: string; 
  description: string; 
  children: ReactNode; 
}) { 
  return ( 
    <div className="group relative flex flex-col gap-5 border-b border-[#f4f0e6]/[0.055] py-6 last:border-b-0 last:pb-0 first:pt-0 sm:flex-row sm:items-center sm:justify-between"> 
      <div className="max-w-2xl"> 
        <p className="text-[13px] font-semibold text-[#dedbd3] transition group-hover:text-[#f4f0e6]"> 
          {title} 
        </p> 
 
        <p className="mt-1.5 text-[11px] leading-5 text-[#777b72]"> 
          {description} 
        </p> 
      </div> 
 
      <div className="shrink-0">{children}</div> 
    </div> 
  ); 
} 
 
const inputClass = 
  "h-12 w-full rounded-xl border border-[#f4f0e6]/[0.08] bg-[#151713] px-4 text-[13px] text-[#f4f0e6] outline-none transition-all placeholder:text-[#676b63] hover:border-[#e7b84b]/20 focus:border-[#e7b84b]/45 focus:bg-[#1b1f19] focus:shadow-[0_0_0_3px_rgba(231,184,75,0.055),0_8px_30px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(245,217,139,0.035)]"; 
 
const cardClass = 
  "relative overflow-hidden rounded-[22px] border border-[#f5d98b]/[0.09] bg-[linear-gradient(145deg,rgba(32,36,29,0.98),rgba(21,23,19,0.98))] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(245,217,139,0.025)] backdrop-blur-2xl transition-all duration-500 hover:border-[#e7b84b]/[0.14] sm:p-8"; 
 
export default function SettingsPage() { 
  const [activeTab, setActiveTab] = useState<Tab>("profile"); 
  const [search, setSearch] = useState(""); 
 
  const [name, setName] = useState("Faiza Noor"); 
  const [email, setEmail] = useState("fizzanoor051@gmail.com"); 
  const [jobTitle, setJobTitle] = useState("Full-Stack Web Engineer"); 
 
  const [workspaceName, setWorkspaceName] = useState("NexaFlow Workspace"); 
  const [workspaceDescription, setWorkspaceDescription] = useState( 
    "AI-powered workflow automation workspace." 
  ); 
 
  const [aiSuggestions, setAiSuggestions] = useState(true); 
  const [leadExtraction, setLeadExtraction] = useState(true); 
  const [taskGeneration, setTaskGeneration] = useState(true); 
  const [smartReplies, setSmartReplies] = useState(true); 
  const [workflowOptimization, setWorkflowOptimization] = useState(true); 
  const [humanApproval, setHumanApproval] = useState(false); 
 
  const [emailNotifications, setEmailNotifications] = useState(true); 
  const [workflowAlerts, setWorkflowAlerts] = useState(true); 
  const [leadAlerts, setLeadAlerts] = useState(true); 
  const [weeklyReport, setWeeklyReport] = useState(true); 
  const [securityAlerts, setSecurityAlerts] = useState(true); 
 
  const [theme, setTheme] = useState("dark"); 
  const [compactMode, setCompactMode] = useState(false); 
  const [animations, setAnimations] = useState(true); 
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); 
 
  const [language, setLanguage] = useState("English"); 
  const [timezone, setTimezone] = useState("Asia/Karachi"); 
 
  const [twoFactor, setTwoFactor] = useState(false); 
  const [loginAlerts, setLoginAlerts] = useState(true); 
 
  const [saved, setSaved] = useState(false); 
  const [refreshing, setRefreshing] = useState(false); 
  const [exporting, setExporting] = useState(false); 
  const [toast, setToast] = useState<Toast | null>(null); 
  const [showPasswordForm, setShowPasswordForm] = useState(false); 
  const [showResetConfirm, setShowResetConfirm] = useState(false); 
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); 
  const [deleteText, setDeleteText] = useState(""); 
 
  const [currentPassword, setCurrentPassword] = useState(""); 
  const [newPassword, setNewPassword] = useState(""); 
  const [confirmPassword, setConfirmPassword] = useState(""); 
 
  const [originalProfile] = useState({ 
    name: "Faiza Noor", 
    email: "fizzanoor051@gmail.com", 
    jobTitle: "Full-Stack Web Engineer", 
  }); 
 
  function showToast(message: string, type: ToastType = "success") { 
    setToast({ message, type }); 
 
    window.setTimeout(() => { 
      setToast(null); 
    }, 3000); 
  } 
 
  function saveSettings() { 
    setSaved(true); 
    showToast("Settings saved successfully.", "success"); 
 
    window.setTimeout(() => { 
      setSaved(false); 
    }, 2200); 
  } 
 
  function resetProfile() { 
    setName(originalProfile.name); 
    setEmail(originalProfile.email); 
    setJobTitle(originalProfile.jobTitle); 
    showToast("Profile changes were reset.", "info"); 
  } 
 
  function refreshSettings() { 
    setRefreshing(true); 
 
    window.setTimeout(() => { 
      setRefreshing(false); 
      showToast("Settings are up to date.", "success"); 
    }, 1000); 
  } 
 
  function exportSettings() { 
    setExporting(true); 
 
    const data = { 
      profile: { name, email, jobTitle }, 
      workspace: { workspaceName, workspaceDescription }, 
      ai: { 
        aiSuggestions, 
        leadExtraction, 
        taskGeneration, 
        smartReplies, 
        workflowOptimization, 
        humanApproval, 
      }, 
      notifications: { 
        emailNotifications, 
        workflowAlerts, 
        leadAlerts, 
        weeklyReport, 
        securityAlerts, 
      }, 
      appearance: { 
        theme, 
        compactMode, 
        animations, 
        sidebarCollapsed, 
      }, 
      preferences: { language, timezone }, 
      security: { twoFactor, loginAlerts }, 
      exportedAt: new Date().toISOString(), 
    }; 
 
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: "application/json", 
    }); 
 
    const url = URL.createObjectURL(blob); 
    const anchor = document.createElement("a"); 
 
    anchor.href = url; 
    anchor.download = "nexaflow-settings.json"; 
    anchor.click(); 
 
    URL.revokeObjectURL(url); 
 
    window.setTimeout(() => { 
      setExporting(false); 
      showToast("Settings exported successfully.", "success"); 
    }, 500); 
  } 
 
  function changePassword() { 
    if (!currentPassword || !newPassword || !confirmPassword) { 
      showToast("Please complete all password fields.", "error"); 
      return; 
    } 
 
    if (newPassword.length < 8) { 
      showToast("New password must contain at least 8 characters.", "error"); 
      return; 
    } 
 
    if (newPassword !== confirmPassword) { 
      showToast("New passwords do not match.", "error"); 
      return; 
    } 
 
    setCurrentPassword(""); 
    setNewPassword(""); 
    setConfirmPassword(""); 
    setShowPasswordForm(false); 
 
    showToast("Password updated successfully.", "success"); 
  } 
 
  function resetAllSettings() { 
    setName("Faiza Noor"); 
    setEmail("fizzanoor051@gmail.com"); 
    setJobTitle("Full-Stack Web Engineer"); 
 
    setWorkspaceName("NexaFlow Workspace"); 
    setWorkspaceDescription("AI-powered workflow automation workspace."); 
 
    setAiSuggestions(true); 
    setLeadExtraction(true); 
    setTaskGeneration(true); 
    setSmartReplies(true); 
    setWorkflowOptimization(true); 
    setHumanApproval(false); 
 
    setEmailNotifications(true); 
    setWorkflowAlerts(true); 
    setLeadAlerts(true); 
    setWeeklyReport(true); 
    setSecurityAlerts(true); 
 
    setTheme("dark"); 
    setCompactMode(false); 
    setAnimations(true); 
    setSidebarCollapsed(false); 
 
    setLanguage("English"); 
    setTimezone("Asia/Karachi"); 
 
    setTwoFactor(false); 
    setLoginAlerts(true); 
 
    setShowResetConfirm(false); 
    showToast("All settings were restored to defaults.", "success"); 
  } 
 
  function signOut() { 
    showToast("Sign-out action triggered.", "info"); 
  } 
 
  function deleteWorkspace() { 
    if (deleteText !== "DELETE") { 
      showToast("Type DELETE to confirm workspace deletion.", "error"); 
      return; 
    } 
 
    setDeleteText(""); 
    setShowDeleteConfirm(false); 
 
    showToast( 
      "Workspace deletion request has been submitted.", 
      "success" 
    ); 
  } 
 
  const filteredTabs = useMemo(() => { 
    const query = search.trim().toLowerCase(); 
 
    if (!query) return tabs; 
 
    return tabs.filter( 
      (tab) => 
        tab.label.toLowerCase().includes(query) || 
        tab.description.toLowerCase().includes(query) 
    ); 
  }, [search]); 
 
  const currentTab = tabs.find((tab) => tab.id === activeTab); 
 
  return ( 
    <div className="relative min-h-full overflow-hidden bg-[#151713] text-white selection:bg-[#e7b84b]/20 selection:text-[#f5d98b]"> 
      {/* PREMIUM ATMOSPHERE */} 
      <div 
        aria-hidden="true" 
        className="pointer-events-none fixed inset-0 overflow-hidden" 
      > 
        <div className="absolute left-[-260px] top-[-260px] h-[650px] w-[650px] rounded-full bg-[#e7b84b]/[0.045] blur-[150px]" /> 
 
        <div className="absolute right-[-250px] top-[12%] h-[650px] w-[650px] rounded-full bg-[#f5d98b]/[0.028] blur-[160px]" /> 
 
        <div className="absolute left-[45%] top-[35%] h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[#9a762e]/[0.018] blur-[130px]" /> 
 
        <div 
          className="absolute inset-0 opacity-[0.14]" 
          style={{ 
            backgroundImage: 
              "linear-gradient(rgba(245,217,139,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(245,217,139,0.028) 1px, transparent 1px)", 
            backgroundSize: "80px 80px", 
            maskImage: 
              "linear-gradient(to bottom, black 0%, transparent 72%)", 
            WebkitMaskImage: 
              "linear-gradient(to bottom, black 0%, transparent 72%)", 
          }} 
        /> 
 
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(231,184,75,0.035),transparent_34%)]" /> 
 
        <div className="absolute left-1/2 top-0 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#f5d98b]/25 to-transparent" /> 
 
        <div className="absolute left-[18%] top-[24%] h-1 w-1 rounded-full bg-[#f5d98b]/30 shadow-[0_0_14px_rgba(245,217,139,0.35)]" /> 
 
        <div className="absolute right-[22%] top-[42%] h-1 w-1 rounded-full bg-[#e7b84b]/25 shadow-[0_0_14px_rgba(231,184,75,0.3)]" /> 
 
        <div className="absolute bottom-[18%] left-[35%] h-1 w-1 rounded-full bg-[#f5d98b]/20 shadow-[0_0_14px_rgba(245,217,139,0.25)]" /> 
      </div> 
 
      <div className="relative z-10 mx-auto w-full max-w-[1540px] px-4 py-5 sm:px-6 lg:px-8 xl:px-10"> 
        {/* COMMAND HEADER */} 
        <header className="relative mb-7 overflow-hidden rounded-[24px] border border-[#f5d98b]/[0.09] bg-[linear-gradient(135deg,rgba(32,36,29,0.96),rgba(15,17,14,0.96))] p-4 shadow-[0_30px_100px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(245,217,139,0.035)] backdrop-blur-2xl sm:p-5"> 
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(231,184,75,0.018),transparent)]" /> 
 
          <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between"> 
            <div className="flex items-center gap-4"> 
              <Link 
                href="/dashboard" 
                className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-[#696d72] transition-all hover:border-[#d8ad55]/25 hover:bg-[#d8ad55]/[0.05] hover:text-[#d8ad55]" 
                aria-label="Back to Dashboard" 
              > 
                <Icon name="arrow" size={16} /> 
              </Link> 
 
              <div className="h-9 w-px bg-white/[0.07]" /> 
 
              <div> 
                <div className="flex items-center gap-2"> 
                  <span className="h-1.5 w-1.5 rounded-full bg-[#e7b84b] shadow-[0_0_10px_rgba(231,184,75,0.8)]" /> 
 
                  <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.25em] text-[#f5d98b]"> 
                    NEXAFLOW / CONTROL 
                  </p> 
                </div> 
 
                <h1 className="mt-1 text-[25px] font-semibold tracking-[-0.04em] text-[#f4f0e6] sm:text-[29px]"> 
                  Settings 
                </h1> 
              </div> 
 
              <div className="hidden h-11 w-px bg-white/[0.06] lg:block" /> 
 
              <p className="hidden max-w-xl text-[11px] leading-5 text-[#777b72] lg:block"> 
                Configure the intelligence, behavior and security layer of 
                your automation workspace. 
              </p> 
            </div> 
 
            <div className="flex flex-wrap items-center gap-2"> 
              <div className="mr-1 hidden items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.035] px-3 py-2 sm:flex"> 
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" /> 
                <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-emerald-300/75"> 
                  System operational 
                </span> 
              </div> 
 
              <button 
                type="button" 
                onClick={refreshSettings} 
                disabled={refreshing} 
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3.5 text-[10px] font-semibold text-[#8a8d91] transition-all hover:border-[#e7b84b]/20 hover:bg-[#e7b84b]/[0.035] hover:text-[#f5d98b] disabled:opacity-50" 
              > 
                <span className={refreshing ? "animate-spin" : ""}> 
                  <Icon name="refresh" size={14} /> 
                </span> 
                {refreshing ? "Syncing" : "Refresh"} 
              </button> 
 
              <button 
                type="button" 
                onClick={exportSettings} 
                disabled={exporting} 
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e7b84b]/15 bg-[#e7b84b]/[0.045] px-3.5 text-[10px] font-semibold text-[#f5d98b] transition-all hover:border-[#e7b84b]/30 hover:bg-[#e7b84b]/[0.08] disabled:opacity-50" 
              > 
                <Icon name="download" size={14} /> 
                {exporting ? "Exporting" : "Export"} 
              </button> 
 
              <button 
                type="button" 
                onClick={saveSettings} 
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#e7b84b] px-4 text-[10px] font-bold text-[#151713] shadow-[0_8px_30px_rgba(231,184,75,0.12)] transition-all hover:bg-[#f5d98b] hover:shadow-[0_10px_35px_rgba(231,184,75,0.2)] active:scale-[0.98]" 
              > 
                <Icon name={saved ? "check" : "save"} size={14} /> 
                {saved ? "Saved" : "Save changes"} 
              </button> 
            </div> 
          </div> 
        </header> 
 
        {/* SEARCH / CONTEXT */} 
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"> 
          <div className="relative w-full max-w-[420px]"> 
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#55595e]"> 
              <Icon name="search" size={15} /> 
            </div> 
 
            <input 
              value={search} 
              onChange={(event) => setSearch(event.target.value)} 
              placeholder="Search configuration..." 
              className="h-11 w-full rounded-xl border border-[#f5d98b]/[0.07] bg-[#151713]/90 pl-10 pr-4 text-[12px] text-white outline-none backdrop-blur-xl transition-all placeholder:text-[#676b63] hover:border-[#e7b84b]/[0.16] focus:border-[#e7b84b]/30 focus:bg-[#1b1f19]" 
            /> 
          </div> 
 
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-[#50545a]"> 
            <span>Control center</span> 
            <span className="text-[#2f3235]">/</span> 
            <span className="text-[#e7b84b]">{currentTab?.label}</span> 
          </div> 
        </div> 
 
        <div className="grid gap-6 xl:grid-cols-[278px_minmax(0,1fr)]"> 
          {/* SIDEBAR */} 
          <aside className="h-fit xl:sticky xl:top-5"> 
            <div className="relative overflow-hidden rounded-[22px] border border-[#f5d98b]/[0.09] bg-[#1b1f19]/90 p-2 shadow-[0_30px_90px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(245,217,139,0.025)] backdrop-blur-2xl"> 
              <div className="pointer-events-none absolute left-0 top-0 h-32 w-full bg-gradient-to-b from-[#e7b84b]/[0.025] to-transparent" /> 
 
              <div className="hidden border-b border-white/[0.055] px-4 pb-4 pt-3 xl:block"> 
                <div className="flex items-center justify-between"> 
                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#777b72]"> 
                    Configuration 
                  </p> 
 
                  <span className="font-mono text-[8px] text-[#4d514b]"> 
                    07 
                  </span> 
                </div> 
              </div> 
 
              <div className="relative grid grid-cols-2 gap-1 sm:grid-cols-3 xl:grid-cols-1"> 
                {filteredTabs.map((tab, index) => { 
                  const selected = activeTab === tab.id; 
 
                  return ( 
                    <button 
                      key={tab.id} 
                      type="button" 
                      onClick={() => setActiveTab(tab.id)} 
                      className={`group relative flex min-h-[62px] items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-left transition-all duration-300 ${ 
                        selected 
                          ? "border border-[#e7b84b]/20 bg-gradient-to-r from-[#e7b84b]/[0.11] via-[#e7b84b]/[0.035] to-transparent shadow-[inset_3px_0_0_#e7b84b,0_8px_25px_rgba(0,0,0,0.12)]" 
                          : "border border-transparent text-[#5e6267] hover:bg-white/[0.025] hover:text-[#c4c6c8]" 
                      }`} 
                    > 
                      {selected && ( 
                        <> 
                          <span className="absolute left-0 top-[12%] h-[76%] w-px bg-[#f5d98b] shadow-[0_0_12px_rgba(245,217,139,0.8)]" /> 
                          <span className="absolute right-0 top-0 h-full w-20 bg-[#e7b84b]/[0.035] blur-xl" /> 
                        </> 
                      )} 
 
                      <span 
                        className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all ${ 
                          selected 
                            ? "border-[#f5d98b]/25 bg-gradient-to-br from-[#e7b84b]/[0.16] to-[#e7b84b]/[0.035] text-[#f5d98b] shadow-[0_0_22px_rgba(231,184,75,0.08)]" 
                            : "border-white/[0.055] bg-white/[0.018] text-[#51555a] group-hover:border-white/[0.1] group-hover:text-[#a0a3a6]" 
                        }`} 
                      > 
                        <Icon name={iconMap[tab.id]} size={16} /> 
                      </span> 
 
                      <span className="relative min-w-0"> 
                        <span 
                          className={`block truncate text-[11px] font-semibold ${ 
                            selected ? "text-[#f4f0e6]" : "" 
                          }`} 
                        > 
                          {tab.label} 
                        </span> 
 
                        <span className="mt-1 hidden truncate text-[9px] text-[#4e5257] xl:block"> 
                          {tab.description} 
                        </span> 
                      </span> 
 
                      <span className="ml-auto hidden font-mono text-[8px] text-[#3e4144] xl:block"> 
                        {String(index + 1).padStart(2, "0")} 
                      </span> 
                    </button> 
                  ); 
                })} 
              </div> 
 
              <div className="mt-2 hidden border-t border-white/[0.055] pt-2 xl:block"> 
                <button 
                  type="button" 
                  onClick={signOut} 
                  className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[10px] font-semibold text-[#55595e] transition hover:bg-red-400/[0.035] hover:text-red-300" 
                > 
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.055] bg-white/[0.018] transition group-hover:border-red-400/15"> 
                    <Icon name="logout" size={14} /> 
                  </span> 
                  Sign out 
                </button> 
              </div> 
            </div> 
 
            <div className="mt-3 hidden rounded-2xl border border-[#f5d98b]/[0.055] bg-[#1b1f19]/[0.55] p-4 shadow-[inset_0_1px_0_rgba(245,217,139,0.018)] xl:block"> 
              <div className="flex items-center gap-2"> 
                <span className="h-1.5 w-1.5 rounded-full bg-[#e7b84b] shadow-[0_0_8px_rgba(231,184,75,0.4)]" /> 
                <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#676b70]"> 
                  Workspace 
                </span> 
              </div> 
 
              <p className="mt-2 truncate text-[11px] font-medium text-[#a7a9ac]"> 
                {workspaceName} 
              </p> 
 
              <div className="mt-3 h-px bg-white/[0.05]" /> 
 
              <p className="mt-3 text-[8px] uppercase tracking-[0.14em] text-[#484b4f]"> 
                Local demo environment 
              </p> 
            </div> 
          </aside> 
 
          {/* CONTENT */} 
          <main className="min-w-0 space-y-6"> 
            {/* PROFILE */} 
            {activeTab === "profile" && ( 
              <> 
                <section className={cardClass}> 
                  <div className="pointer-events-none absolute right-[-120px] top-[-150px] h-[360px] w-[360px] rounded-full bg-[#e7b84b]/[0.035] blur-[100px]" /> 
                  <div className="pointer-events-none absolute bottom-0 left-0 h-px w-2/5 bg-gradient-to-r from-[#e7b84b]/25 to-transparent" /> 
 
                  <SectionHeader 
                    number="01" 
                    eyebrow="Account identity" 
                    title="Profile information" 
                    description="Manage the identity attached to your NexaFlow workspace and the professional information shown across your account." 
                  /> 
 
                  <div className="relative mb-8 overflow-hidden rounded-[20px] border border-[#f5d98b]/[0.065] bg-[#151713] p-5 shadow-[inset_0_1px_0_rgba(245,217,139,0.025)] sm:p-6"> 
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-[45%] bg-gradient-to-l from-[#e7b84b]/[0.035] to-transparent" /> 
                    <div className="pointer-events-none absolute bottom-0 left-0 h-px w-1/3 bg-gradient-to-r from-[#e7b84b]/20 to-transparent" /> 
 
                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center"> 
                      <div className="relative"> 
                        <div className="flex h-[76px] w-[76px] items-center justify-center rounded-[20px] border border-[#f5d98b]/25 bg-gradient-to-br from-[#f5d98b] via-[#e7b84b] to-[#8d6727] text-[22px] font-bold tracking-[-0.06em] text-[#171209] shadow-[0_18px_50px_rgba(231,184,75,0.16),inset_0_1px_0_rgba(255,255,255,0.2)]"> 
                          FN 
                        </div> 
 
                        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-[3px] border-[#151713] bg-emerald-400 shadow-[0_0_12px_rgba(94,214,160,0.45)]"> 
                          <span className="h-1.5 w-1.5 rounded-full bg-[#062d1b]" /> 
                        </span> 
                      </div> 
 
                      <div className="min-w-0"> 
                        <p className="text-[17px] font-semibold tracking-tight text-[#f0ece3]"> 
                          {name} 
                        </p> 
 
                        <p className="mt-1 text-[11px] text-[#777b72]"> 
                          {email} 
                        </p> 
 
                        <div className="mt-3 flex flex-wrap items-center gap-2"> 
                          <span className="rounded-full border border-[#e7b84b]/15 bg-[#e7b84b]/[0.05] px-2.5 py-1 text-[9px] font-semibold text-[#f5d98b]"> 
                            {jobTitle} 
                          </span> 
 
                          <span className="rounded-full border border-emerald-400/10 bg-emerald-400/[0.035] px-2.5 py-1 text-[9px] font-semibold text-emerald-300/75"> 
                            Active account 
                          </span> 
                        </div> 
                      </div> 
 
                      <div className="sm:ml-auto sm:text-right"> 
                        <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#45484b]"> 
                          Account ID 
                        </p> 
 
                        <p className="mt-1 font-mono text-[9px] text-[#686b6e]"> 
                          NFX-LOCAL-01 
                        </p> 
                      </div> 
                    </div> 
                  </div> 
 
                  <div className="grid gap-5 md:grid-cols-2"> 
                    <label className="block"> 
                      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#888b8f]"> 
                        Full name 
                      </span> 
 
                      <input 
                        value={name} 
                        onChange={(event) => setName(event.target.value)} 
                        className={inputClass} 
                      /> 
                    </label> 
 
                    <label className="block"> 
                      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#888b8f]"> 
                        Email address 
                      </span> 
 
                      <input 
                        value={email} 
                        onChange={(event) => setEmail(event.target.value)} 
                        type="email" 
                        className={inputClass} 
                      /> 
                    </label> 
 
                    <label className="block md:col-span-2"> 
                      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#888b8f]"> 
                        Professional title 
                      </span> 
 
                      <input 
                        value={jobTitle} 
                        onChange={(event) => setJobTitle(event.target.value)} 
                        className={inputClass} 
                      /> 
                    </label> 
                  </div> 
 
                  <div className="mt-7 flex flex-wrap gap-3"> 
                    <button 
                      type="button" 
                      onClick={saveSettings} 
                      className="rounded-xl bg-[#e7b84b] px-5 py-3 text-[10px] font-bold text-[#151713] shadow-[0_10px_30px_rgba(231,184,75,0.1)] transition hover:bg-[#f5d98b]" 
                    > 
                      {saved ? "Changes saved" : "Save profile"} 
                    </button> 
 
                    <button 
                      type="button" 
                      onClick={resetProfile} 
                      className="rounded-xl border border-white/[0.08] bg-white/[0.025] px-5 py-3 text-[10px] font-semibold text-[#85888c] transition hover:border-[#e7b84b]/[0.18] hover:bg-[#e7b84b]/[0.035] hover:text-[#f4f0e6]" 
                    > 
                      Reset profile 
                    </button> 
                  </div> 
                </section> 
 
                <section className={cardClass}> 
                  <SectionHeader 
                    number="02" 
                    eyebrow="Localization" 
                    title="Regional preferences" 
                    description="Choose the language and timezone used throughout your workspace." 
                  /> 
 
                  <div className="grid gap-5 md:grid-cols-2"> 
                    <label> 
                      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#888b8f]"> 
                        Language 
                      </span> 
 
                      <select 
                        value={language} 
                        onChange={(event) => { 
                          setLanguage(event.target.value); 
                          showToast( 
                            `Language changed to ${event.target.value}.`, 
                            "success" 
                          ); 
                        }} 
                        className={inputClass} 
                      > 
                        <option>English</option> 
                        <option>Urdu</option> 
                        <option>Arabic</option> 
                      </select> 
                    </label> 
 
                    <label> 
                      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#888b8f]"> 
                        Timezone 
                      </span> 
 
                      <select 
                        value={timezone} 
                        onChange={(event) => { 
                          setTimezone(event.target.value); 
                          showToast( 
                            `Timezone changed to ${event.target.value}.`, 
                            "success" 
                          ); 
                        }} 
                        className={inputClass} 
                      > 
                        <option value="Asia/Karachi">Asia/Karachi</option> 
                        <option value="UTC">UTC</option> 
                        <option value="Europe/London">Europe/London</option> 
                        <option value="America/New_York"> 
                          America/New_York 
                        </option> 
                        <option value="America/Los_Angeles"> 
                          America/Los_Angeles 
                        </option> 
                      </select> 
                    </label> 
                  </div> 
                </section> 
              </> 
            )} 
 
            {/* WORKSPACE */} 
            {activeTab === "workspace" && ( 
              <> 
                <section className={cardClass}> 
                  <SectionHeader 
                    number="01" 
                    eyebrow="Workspace identity" 
                    title="Workspace configuration" 
                    description="Define how your NexaFlow workspace is identified and described." 
                  /> 
 
                  <div className="space-y-5"> 
                    <label className="block"> 
                      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#888b8f]"> 
                        Workspace name 
                      </span> 
 
                      <input 
                        value={workspaceName} 
                        onChange={(event) => 
                          setWorkspaceName(event.target.value) 
                        } 
                        className={inputClass} 
                      /> 
                    </label> 
 
                    <label className="block"> 
                      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#888b8f]"> 
                        Description 
                      </span> 
 
                      <textarea 
                        value={workspaceDescription} 
                        onChange={(event) => 
                          setWorkspaceDescription(event.target.value) 
                        } 
                        rows={4} 
                        className="w-full resize-none rounded-xl border border-white/[0.08] bg-[#151713] px-4 py-3 text-[13px] leading-6 text-[#eeeae1] outline-none transition hover:border-[#e7b84b]/20 focus:border-[#e7b84b]/40 focus:bg-[#1b1f19]" 
                      /> 
                    </label> 
                  </div> 
 
                  <button 
                    type="button" 
                    onClick={saveSettings} 
                    className="mt-7 rounded-xl bg-[#e7b84b] px-5 py-3 text-[10px] font-bold text-[#151713] transition hover:bg-[#f5d98b]" 
                  > 
                    Save workspace 
                  </button> 
                </section> 
 
                <section className={cardClass}> 
                  <SectionHeader 
                    number="02" 
                    eyebrow="Behavior" 
                    title="Workspace behavior" 
                    description="Control the density and navigation behavior of your automation environment." 
                  /> 
 
                  <SettingRow 
                    title="Compact workspace mode" 
                    description="Reduce spacing throughout workflow and analytics interfaces." 
                  > 
                    <Toggle 
                      enabled={compactMode} 
                      onChange={() => { 
                        setCompactMode((value) => !value); 
                        showToast( 
                          `Compact mode ${ 
                            !compactMode ? "enabled" : "disabled" 
                          }.` 
                        ); 
                      }} 
                      label="Toggle compact workspace mode" 
                    /> 
                  </SettingRow> 
 
                  <SettingRow 
                    title="Collapsed navigation" 
                    description="Keep the main navigation collapsed by default." 
                  > 
                    <Toggle 
                      enabled={sidebarCollapsed} 
                      onChange={() => { 
                        setSidebarCollapsed((value) => !value); 
                        showToast( 
                          `Collapsed navigation ${ 
                            !sidebarCollapsed ? "enabled" : "disabled" 
                          }.` 
                        ); 
                      }} 
                      label="Toggle collapsed navigation" 
                    /> 
                  </SettingRow> 
                </section> 
              </> 
            )} 
        


            {/* AI */} 
            {activeTab === "ai" && ( 
              <section className={`${cardClass} group/ai`}> 
                {/* ADDED: intelligence atmosphere */} 
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_12%,rgba(231,184,75,0.075),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.018),transparent_35%)]" /> 
                <div className="pointer-events-none absolute left-0 top-0 h-px w-28 bg-gradient-to-r from-[#e7b84b]/60 to-transparent" /> 
                <div className="pointer-events-none absolute right-8 top-8 h-20 w-20 rounded-full border border-[#e7b84b]/[0.06]" /> 
                <div className="pointer-events-none absolute right-[42px] top-[42px] h-12 w-12 rounded-full border border-[#e7b84b]/[0.04]" /> 
 
                <div className="pointer-events-none absolute right-[-100px] top-[-130px] h-[360px] w-[360px] rounded-full bg-[#d8ad56]/[0.045] blur-[110px]" /> 
 
                <div className="relative"> 
                  <SectionHeader 
                    number="01" 
                    eyebrow="Intelligence layer" 
                    title="AI & automation" 
                    description="Control how NexaFlow's intelligence assists with workflows, leads, tasks and conversations." 
                  /> 
 
                  {/* ADDED: operational intelligence metrics */} 
                  <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4"> 
                    {[ 
                      ["ENGINE", "ONLINE"], 
                      ["MODULES", "05 ACTIVE"], 
                      ["LATENCY", "42ms"], 
                      ["MODE", "ADAPTIVE"], 
                    ].map(([label, value]) => ( 
                      <div key={label} className="rounded-xl border border-white/[0.055] bg-black/20 px-3 py-3"> 
                        <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-[#4e514f]">{label}</p> 
                        <p className="mt-1 font-mono text-[9px] font-semibold text-[#c9aa61]">{value}</p> 
                      </div> 
                    ))} 
                  </div> 
 
                  <div className="mb-7 flex items-center gap-4 rounded-[18px] border border-[#d7ad57]/10 bg-gradient-to-r from-[#d7ad57]/[0.045] to-transparent p-4"> 
                    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#d7ad57]/15 bg-[#d7ad57]/[0.06] text-[#ddb760]"> 
                      <span className="absolute inset-0 rounded-xl bg-[#d7ad57]/10 blur-md" /> 
                      <span className="relative"><Icon name="spark" size={19} /></span> 
                    </div> 
 
                    <div> 
                      <p className="text-[11px] font-semibold text-[#d9d4c9]"> 
                        Intelligence engine 
                      </p> 
 
                      <p className="mt-1 text-[10px] text-[#62666b]"> 
                        AI assistance is currently active across your workspace. 
                      </p> 
                    </div> 
 
                    <span className="ml-auto hidden rounded-full border border-emerald-400/10 bg-emerald-400/[0.035] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-emerald-300/70 sm:block"> 
                      Online 
                    </span> 
                  </div> 
 
                  <SettingRow 
                    title="AI workflow suggestions" 
                    description="Recommend automation workflows based on workspace activity." 
                  > 
                    <Toggle 
                      enabled={aiSuggestions} 
                      onChange={() => { 
                        setAiSuggestions((value) => !value); 
                        showToast( 
                          `AI workflow suggestions ${ 
                            !aiSuggestions ? "enabled" : "disabled" 
                          }.` 
                        ); 
                      }} 
                      label="Toggle AI workflow suggestions" 
                    /> 
                  </SettingRow> 
 
                  <SettingRow 
                    title="Automatic lead extraction" 
                    description="Extract useful lead information from supported conversations and workflow inputs." 
                  > 
                    <Toggle 
                      enabled={leadExtraction} 
                      onChange={() => { 
                        setLeadExtraction((value) => !value); 
                        showToast( 
                          `Lead extraction ${ 
                            !leadExtraction ? "enabled" : "disabled" 
                          }.` 
                        ); 
                      }} 
                      label="Toggle automatic lead extraction" 
                    /> 
                  </SettingRow> 
 
                  <SettingRow 
                    title="Task generation" 
                    description="Automatically turn relevant AI analysis into actionable tasks." 
                  > 
                    <Toggle 
                      enabled={taskGeneration} 
                      onChange={() => { 
                        setTaskGeneration((value) => !value); 
                        showToast( 
                          `Task generation ${ 
                            !taskGeneration ? "enabled" : "disabled" 
                          }.` 
                        ); 
                      }} 
                      label="Toggle task generation" 
                    /> 
                  </SettingRow> 
 
                  <SettingRow 
                    title="Smart replies" 
                    description="Generate contextual response suggestions inside supported communication workflows." 
                  > 
                    <Toggle 
                      enabled={smartReplies} 
                      onChange={() => { 
                        setSmartReplies((value) => !value); 
                        showToast( 
                          `Smart replies ${ 
                            !smartReplies ? "enabled" : "disabled" 
                          }.` 
                        ); 
                      }} 
                      label="Toggle smart replies" 
                    /> 
                  </SettingRow> 
 
                  <SettingRow 
                    title="Workflow optimization" 
                    description="Allow AI to identify possible improvements to workflow performance." 
                  > 
                    <Toggle 
                      enabled={workflowOptimization} 
                      onChange={() => { 
                        setWorkflowOptimization((value) => !value); 
                        showToast( 
                          `Workflow optimization ${ 
                            !workflowOptimization ? "enabled" : "disabled" 
                          }.` 
                        ); 
                      }} 
                      label="Toggle workflow optimization" 
                    /> 
                  </SettingRow> 
 
                  <SettingRow 
                    title="Human approval before execution" 
                    description="Require manual confirmation before AI-generated workflow actions are executed." 
                  > 
                    <Toggle 
                      enabled={humanApproval} 
                      onChange={() => { 
                        setHumanApproval((value) => !value); 
                        showToast( 
                          `Human approval ${ 
                            !humanApproval ? "enabled" : "disabled" 
                          }.` 
                        ); 
                      }} 
                      label="Toggle human approval" 
                    /> 
                  </SettingRow> 
                </div> 
              </section> 
            )} 
 
            {/* NOTIFICATIONS */} 
            {activeTab === "notifications" && ( 
              <section className={`${cardClass} group/notifications`}> 
                {/* ADDED: communication signal */} 
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e7b84b]/35 to-transparent" /> 
                <div className="pointer-events-none absolute right-[-120px] top-[-150px] h-[320px] w-[320px] rounded-full bg-[#e7b84b]/[0.025] blur-[100px]" /> 
 
                <SectionHeader 
                  number="01" 
                  eyebrow="Communication layer" 
                  title="Notification control" 
                  description="Choose which events should interrupt your workflow and which should remain silent." 
                /> 
 
                {/* ADDED: notification telemetry */} 
                <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border border-white/[0.05] bg-black/15 px-4 py-3"> 
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.65)]" /> 
                  <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#666a67]">Notification routing active</span> 
                  <span className="ml-auto font-mono text-[8px] text-[#9b8148]">REAL-TIME</span> 
                </div> 
 
                <SettingRow 
                  title="Email notifications" 
                  description="Receive important workspace updates through email." 
                > 
                  <Toggle 
                    enabled={emailNotifications} 
                    onChange={() => { 
                      setEmailNotifications((value) => !value); 
                      showToast( 
                        `Email notifications ${ 
                          !emailNotifications ? "enabled" : "disabled" 
                        }.` 
                      ); 
                    }} 
                    label="Toggle email notifications" 
                  /> 
                </SettingRow> 
 
                <SettingRow 
                  title="Workflow alerts" 
                  description="Get notified when workflow executions succeed, fail or require attention." 
                > 
                  <Toggle 
                    enabled={workflowAlerts} 
                    onChange={() => { 
                      setWorkflowAlerts((value) => !value); 
                      showToast( 
                        `Workflow alerts ${ 
                          !workflowAlerts ? "enabled" : "disabled" 
                        }.` 
                      ); 
                    }} 
                    label="Toggle workflow alerts" 
                  /> 
                </SettingRow> 
 
                <SettingRow 
                  title="Lead alerts" 
                  description="Receive notifications when new leads are detected or updated." 
                > 
                  <Toggle 
                    enabled={leadAlerts} 
                    onChange={() => { 
                      setLeadAlerts((value) => !value); 
                      showToast( 
                        `Lead alerts ${ 
                          !leadAlerts ? "enabled" : "disabled" 
                        }.` 
                      ); 
                    }} 
                    label="Toggle lead alerts" 
                  /> 
                </SettingRow> 
 
                <SettingRow 
                  title="Weekly analytics report" 
                  description="Receive a weekly summary of automation activity and performance." 
                > 
                  <Toggle 
                    enabled={weeklyReport} 
                    onChange={() => { 
                      setWeeklyReport((value) => !value); 
                      showToast( 
                        `Weekly report ${ 
                          !weeklyReport ? "enabled" : "disabled" 
                        }.` 
                      ); 
                    }} 
                    label="Toggle weekly analytics report" 
                  /> 
                </SettingRow> 
 
                <SettingRow 
                  title="Security alerts" 
                  description="Always receive alerts related to important account and security events." 
                > 
                  <Toggle 
                    enabled={securityAlerts} 
                    onChange={() => { 
                      setSecurityAlerts((value) => !value); 
                      showToast( 
                        `Security alerts ${ 
                          !securityAlerts ? "enabled" : "disabled" 
                        }.` 
                      ); 
                    }} 
                    label="Toggle security alerts" 
                  /> 
                </SettingRow> 
              </section> 
            )} 
 
            {/* APPEARANCE */} 
            {activeTab === "appearance" && ( 
              <> 
                <section className={`${cardClass} group/appearance`}> 
                  {/* ADDED: visual-system atmosphere */} 
                  <div className="pointer-events-none absolute left-0 top-0 h-px w-36 bg-gradient-to-r from-[#e7b84b]/55 to-transparent" /> 
                  <div className="pointer-events-none absolute right-[-100px] top-[-120px] h-[300px] w-[300px] rounded-full bg-[#e7b84b]/[0.025] blur-[100px]" /> 
 
                  <SectionHeader 
                    number="01" 
                    eyebrow="Visual system" 
                    title="Appearance" 
                    description="Personalize the visual experience of your NexaFlow command center." 
                  /> 
 
                  <div className="grid gap-4 md:grid-cols-3"> 
                    {[ 
                      { 
                        id: "dark", 
                        label: "Obsidian", 
                        description: "Deep command-center theme", 
                      }, 
                      { 
                        id: "light", 
                        label: "Light", 
                        description: "Bright workspace theme", 
                      }, 
                      { 
                        id: "system", 
                        label: "System", 
                        description: "Follow device preference", 
                      }, 
                    ].map((option) => { 
                      const selected = theme === option.id; 
 
                      return ( 
                        <button 
                          key={option.id} 
                          type="button" 
                          onClick={() => { 
                            setTheme(option.id); 
                            showToast(`${option.label} theme selected.`); 
                          }} 
                          className={`group overflow-hidden rounded-[18px] border p-4 text-left transition-all duration-300 ${ 
                            selected 
                              ? "border-[#d9ae58]/35 bg-[#d9ae58]/[0.055] shadow-[0_0_40px_rgba(214,169,79,0.06)]" 
                              : "border-white/[0.07] bg-[#080807] hover:border-white/[0.14] hover:bg-white/[0.025]" 
                          }`} 
                        > 
                          <div 
                            className={`relative mb-4 h-24 overflow-hidden rounded-xl border ${ 
                              option.id === "dark" 
                                ? "border-[#d8ad56]/15 bg-[#070706]" 
                                : option.id === "light" 
                                  ? "border-slate-200 bg-[#f1f1ed]" 
                                  : "border-white/10 bg-gradient-to-br from-[#080807] via-[#11110f] to-[#dddcd5]" 
                            }`} 
                          > 
                            {/* ADDED: miniature NexaFlow interface preview */} 
                            <div className="absolute inset-0 flex"> 
                              <div className="w-[18%] border-r border-white/[0.05] bg-black/20 p-1.5"> 
                                <div className="h-1.5 w-full rounded bg-white/[0.08]" /> 
                                <div className="mt-2 h-1 w-[75%] rounded bg-[#d8ad56]/45" /> 
                                <div className="mt-1 h-1 w-[60%] rounded bg-white/[0.05]" /> 
                                <div className="mt-1 h-1 w-[70%] rounded bg-white/[0.05]" /> 
                              </div> 
                              <div className="flex-1 p-2"> 
                                <div className="h-2 w-[45%] rounded bg-white/[0.08]" /> 
                                <div className="mt-2 grid grid-cols-2 gap-1.5"> 
                                  <div className="h-7 rounded border border-white/[0.045] bg-white/[0.025]" /> 
                                  <div className="h-7 rounded border border-white/[0.045] bg-white/[0.025]" /> 
                                </div> 
                                <div className="mt-1.5 h-4 rounded border border-[#d8ad56]/10 bg-[#d8ad56]/[0.035]" /> 
                              </div> 
                            </div> 
 
                            {option.id === "dark" && ( 
                              <> 
                                <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d8ad56]/[0.12] blur-2xl" /> 
                                <div className="absolute bottom-3 left-4 right-4 h-1 rounded-full bg-white/[0.07]" /> 
                                <div className="absolute bottom-3 left-4 h-1 w-[38%] rounded-full bg-[#d8ad56]/60" /> 
                              </> 
                            )} 
                          </div> 
 
                          <div className="flex items-center justify-between"> 
                            <span className="text-[12px] font-semibold text-[#e6e2d9]"> 
                              {option.label} 
                            </span> 
 
                            {selected && ( 
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#dfb35a] text-[#151209]"> 
                                <Icon name="check" size={11} /> 
                              </span> 
                            )} 
                          </div> 
 
                          <p className="mt-1 text-[9px] text-[#5e6267]"> 
                            {option.description} 
                          </p> 
                        </button> 
                      ); 
                    })} 
                  </div> 
                </section> 
 
                <section className={`${cardClass} group/interface`}> 
                  <div className="pointer-events-none absolute right-0 top-0 h-px w-28 bg-gradient-to-l from-[#e7b84b]/35 to-transparent" /> 
                  <SectionHeader 
                    number="02" 
                    eyebrow="Experience" 
                    title="Interface behavior" 
                    description="Control motion and visual density across the application." 
                  /> 
 
                  <SettingRow 
                    title="Interface animations" 
                    description="Use subtle transitions and motion throughout the workspace." 
                  > 
                    <Toggle 
                      enabled={animations} 
                      onChange={() => { 
                        setAnimations((value) => !value); 
                        showToast( 
                          `Animations ${ 
                            !animations ? "enabled" : "disabled" 
                          }.` 
                        ); 
                      }} 
                      label="Toggle interface animations" 
                    /> 
                  </SettingRow> 
                </section> 
              </> 
            )} 
 
            {/* SECURITY */} 
            {activeTab === "security" && ( 
              <> 
                <section className={`${cardClass} group/security`}> 
                  {/* ADDED: security protection aura */} 
                  <div className="pointer-events-none absolute right-[-120px] top-[-130px] h-[360px] w-[360px] rounded-full bg-emerald-400/[0.025] blur-[110px]" /> 
                  <div className="pointer-events-none absolute left-0 top-0 h-px w-32 bg-gradient-to-r from-emerald-400/35 to-transparent" /> 
 
                  <SectionHeader 
                    number="01" 
                    eyebrow="Protection layer" 
                    title="Account security" 
                    description="Protect your NexaFlow account with stronger authentication and session monitoring." 
                  /> 
 
                  {/* ADDED: security score */} 
                  <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_auto]"> 
                    <div className="rounded-[18px] border border-emerald-400/[0.08] bg-emerald-400/[0.018] p-4"> 
                      <div className="flex items-center justify-between"> 
                        <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#5b635d]">Protection score</p> 
                        <span className="font-mono text-[9px] font-bold text-emerald-300/75">82 / 100</span> 
                      </div> 
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.05]"> 
                        <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-emerald-500/70 to-[#9ce5bc]" /> 
                      </div> 
                    </div> 
 
                    <div className="flex min-w-[150px] items-center gap-3 rounded-[18px] border border-white/[0.055] bg-black/15 px-4 py-3"> 
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/15 bg-emerald-400/[0.035]"> 
                        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" /> 
                      </div> 
                      <div> 
                        <p className="font-mono text-[7px] uppercase tracking-[0.15em] text-[#555c57]">Session</p> 
                        <p className="mt-1 text-[10px] font-semibold text-emerald-300/75">MONITORED</p> 
                      </div> 
                    </div> 
                  </div> 
 
                  <div className="mb-7 flex items-center gap-4 rounded-[18px] border border-emerald-400/10 bg-emerald-400/[0.025] p-4"> 
                    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/[0.035] text-emerald-300/80"> 
                      <span className="absolute inset-1 rounded-lg border border-emerald-400/[0.06]" /> 
                      <span className="relative"><Icon name="lock" size={18} /></span> 
                    </div> 
 
                    <div> 
                      <p className="text-[11px] font-semibold text-[#d7d4cd]"> 
                        Security monitoring active 
                      </p> 
 
                      <p className="mt-1 text-[10px] text-[#62666b]"> 
                        Login alerts are currently enabled. 
                      </p> 
                    </div> 
 
                    <span className="ml-auto hidden font-mono text-[8px] uppercase tracking-[0.15em] text-emerald-300/60 sm:block"> 
                      Protected 
                    </span> 
                  </div> 
 
                  <SettingRow 
                    title="Two-factor authentication" 
                    description="Add an additional verification step when signing into your account." 
                  > 
                    <Toggle 
                      enabled={twoFactor} 
                      onChange={() => { 
                        setTwoFactor((value) => !value); 
                        showToast( 
                          `Two-factor authentication ${ 
                            !twoFactor ? "enabled" : "disabled" 
                          }.` 
                        ); 
                      }} 
                      label="Toggle two-factor authentication" 
                    /> 
                  </SettingRow> 
 
                  <SettingRow 
                    title="Login alerts" 
                    description="Receive an alert when your account is accessed from a new session." 
                  > 
                    <Toggle 
                      enabled={loginAlerts} 
                      onChange={() => { 
                        setLoginAlerts((value) => !value); 
                        showToast( 
                          `Login alerts ${ 
                            !loginAlerts ? "enabled" : "disabled" 
                          }.` 
                        ); 
                      }} 
                      label="Toggle login alerts" 
                    /> 
                  </SettingRow> 
                </section> 
 
                <section className={`${cardClass} group/password`}> 
                  <SectionHeader 
                    number="02" 
                    eyebrow="Credentials" 
                    title="Password" 
                    description="Update your account password. For a production backend, connect this action to your authentication API." 
                  /> 
 
                  {/* ADDED: credential status strip */} 
                  <div className="mb-5 flex items-center gap-3 rounded-xl border border-white/[0.05] bg-black/15 px-4 py-3"> 
                    <span className="h-1.5 w-1.5 rounded-full bg-[#e7b84b] shadow-[0_0_8px_rgba(231,184,75,0.55)]" /> 
                    <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#62655f]">Credential management</span> 
                    <span className="ml-auto font-mono text-[8px] text-[#817044]">LOCAL DEMO</span> 
                  </div> 
 
                  {!showPasswordForm ? ( 
                    <button 
                      type="button" 
                      onClick={() => setShowPasswordForm(true)} 
                      className="rounded-xl border border-white/[0.09] bg-white/[0.025] px-5 py-3 text-[10px] font-semibold text-[#d7d4cc] transition hover:border-[#d6a94f]/20 hover:bg-[#d6a94f]/[0.045] hover:text-[#e6bf70]" 
                    > 
                      Change password 
                    </button> 
                  ) : ( 
                    <div className="max-w-xl space-y-4"> 
                      <input 
                        type="password" 
                        value={currentPassword} 
                        onChange={(event) => 
                          setCurrentPassword(event.target.value) 
                        } 
                        placeholder="Current password" 
                        className={inputClass} 
                      /> 
 
                      <input 
                        type="password" 
                        value={newPassword} 
                        onChange={(event) => 
                          setNewPassword(event.target.value) 
                        } 
                        placeholder="New password" 
                        className={inputClass} 
                      /> 
 
                      <input 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(event) => 
                          setConfirmPassword(event.target.value) 
                        } 
                        placeholder="Confirm new password" 
                        className={inputClass} 
                      /> 
 
                      <div className="flex flex-wrap gap-3 pt-2"> 
                        <button 
                          type="button" 
                          onClick={changePassword} 
                          className="rounded-xl bg-[#dfb35a] px-5 py-3 text-[10px] font-bold text-[#151209] transition hover:bg-[#edc46d]" 
                        > 
                          Update password 
                        </button> 
 
                        <button 
                          type="button" 
                          onClick={() => { 
                            setShowPasswordForm(false); 
                            setCurrentPassword(""); 
                            setNewPassword(""); 
                            setConfirmPassword(""); 
                          }} 
                          className="rounded-xl border border-white/[0.08] px-5 py-3 text-[10px] font-semibold text-[#777b80] transition hover:bg-white/[0.04] hover:text-white" 
                        > 
                          Cancel 
                        </button> 
                      </div> 
                    </div> 
                  )} 
                </section> 
              </> 
            )} 
 
            {/* DATA */} 
            {activeTab === "data" && ( 
              <> 
                <section className={`${cardClass} group/data`}> 
                  <div className="pointer-events-none absolute left-0 top-0 h-px w-32 bg-gradient-to-r from-[#e7b84b]/45 to-transparent" /> 
                  <SectionHeader 
                    number="01" 
                    eyebrow="Data portability" 
                    title="Export your settings" 
                    description="Download a portable JSON copy of your current NexaFlow preferences." 
                  /> 
 
                  <div className="mb-4 flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.16em] text-[#4e514f]"> 
                    <span className="h-px w-6 bg-[#e7b84b]/25" /> 
                    <span>Portable configuration package</span> 
                  </div> 
 
                  <div className="flex flex-col gap-5 rounded-[18px] border border-white/[0.065] bg-[#070706] p-5 sm:flex-row sm:items-center sm:justify-between"> 
                    <div className="flex items-center gap-4"> 
                      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#d6a94f]/15 bg-[#d6a94f]/[0.045] text-[#d8b15f]"> 
                        <span className="absolute inset-0 rounded-xl bg-[#d6a94f]/10 blur-md" /> 
                        <span className="relative"><Icon name="download" size={17} /></span> 
                      </div> 
 
                      <div> 
                        <p className="text-[11px] font-semibold text-[#d9d6cf]"> 
                          Settings export 
                        </p> 
 
                        <p className="mt-1 max-w-xl text-[10px] leading-5 text-[#606469]"> 
                          Includes profile, workspace, AI, notification, 
                          appearance and security preferences. 
                        </p> 
                      </div> 
                    </div> 
 
                    <button 
                      type="button" 
                      onClick={exportSettings} 
                      disabled={exporting} 
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#d6a94f]/15 bg-[#d6a94f]/[0.055] px-5 py-3 text-[10px] font-semibold text-[#dcb565] transition hover:border-[#d6a94f]/30 hover:bg-[#d6a94f]/[0.1] disabled:opacity-50" 
                    > 
                      <Icon name="download" size={14} /> 
                      {exporting ? "Exporting..." : "Export JSON"} 
                    </button> 
                  </div> 
                </section> 
 
                <section className="relative overflow-hidden rounded-[22px] border border-red-400/[0.13] bg-[linear-gradient(145deg,rgba(22,12,12,0.96),rgba(10,8,8,0.96))] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.3)] sm:p-8"> 
                  {/* ADDED: restrained danger-zone signal */} 
                  <div className="pointer-events-none absolute left-0 top-0 h-px w-40 bg-gradient-to-r from-red-400/45 to-transparent" /> 
                  <div className="pointer-events-none absolute right-8 top-8 h-16 w-16 rounded-full border border-red-400/[0.05]" /> 
                  <div className="pointer-events-none absolute right-12 top-12 h-8 w-8 rounded-full border border-red-400/[0.04]" /> 
 
                  <div className="pointer-events-none absolute right-[-120px] top-[-140px] h-[340px] w-[340px] rounded-full bg-red-500/[0.025] blur-[110px]" /> 
 
                  <div className="relative"> 
                    <SectionHeader 
                      number="02" 
                      eyebrow="Danger zone" 
                      title="Reset or delete" 
                      description="These actions can affect your workspace configuration. Use them carefully." 
                    /> 
 
                    <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-400/[0.07] bg-red-400/[0.015] px-4 py-3"> 
                      <span className="h-1.5 w-1.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.55)]" /> 
                      <span className="font-mono text-[8px] uppercase tracking-[0.17em] text-red-200/45">Restricted operations</span> 
                      <span className="ml-auto font-mono text-[8px] text-red-300/35">CONFIRMATION REQUIRED</span> 
                    </div> 
 
                    <div className="space-y-4"> 
                      <div className="flex flex-col gap-4 rounded-[18px] border border-white/[0.065] bg-black/20 p-5 sm:flex-row sm:items-center sm:justify-between"> 
                        <div> 
                          <p className="text-[11px] font-semibold text-[#ddd9d1]"> 
                            Reset all settings 
                          </p> 
 
                          <p className="mt-1 text-[10px] leading-5 text-[#61656a]"> 
                            Restore NexaFlow settings to their default values. 
                          </p> 
                        </div> 
 
                        <button 
                          type="button" 
                          onClick={() => setShowResetConfirm(true)} 
                          className="rounded-xl border border-white/[0.09] px-4 py-2.5 text-[10px] font-semibold text-[#85898d] transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white" 
                        > 
                          Reset settings 
                        </button> 
                      </div> 
 
                      <div className="flex flex-col gap-4 rounded-[18px] border border-red-400/10 bg-red-400/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between"> 
                        <div> 
                          <p className="text-[11px] font-semibold text-red-200"> 
                            Delete workspace 
                          </p> 
 
                          <p className="mt-1 text-[10px] leading-5 text-red-200/40"> 
                            Permanently request deletion of this workspace. 
                          </p> 
                        </div> 
 
                        <button 
                          type="button" 
                          onClick={() => setShowDeleteConfirm(true)} 
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/15 bg-red-400/[0.04] px-4 py-2.5 text-[10px] font-semibold text-red-300 transition hover:border-red-400/30 hover:bg-red-400/[0.08]" 
                        > 
                          <Icon name="trash" size={13} /> 
                          Delete workspace 
                        </button> 
                      </div> 
                    </div> 
                  </div> 
                </section> 
              </> 
            )} 
 
            {/* FOOTER */} 
            <footer className="relative flex flex-col gap-3 border-t border-white/[0.055] px-1 pt-5 text-[9px] text-[#494d51] sm:flex-row sm:items-center sm:justify-between"> 
              {/* ADDED: footer signal */} 
              <div className="pointer-events-none absolute left-0 top-[-1px] h-px w-16 bg-[#e7b84b]/25" /> 
 
              <p> 
                NexaFlow Settings · Preferences are stored locally in this 
                demo interface. 
              </p> 
 
              <div className="flex items-center gap-5"> 
                <button 
                  type="button" 
                  onClick={() => { 
                    setActiveTab("data"); 
                    showToast("Privacy controls opened.", "info"); 
                  }} 
                  className="transition hover:text-[#c8a45a]" 
                > 
                  Privacy 
                </button> 
 
                <button 
                  type="button" 
                  onClick={() => { 
                    setActiveTab("security"); 
                    showToast("Security controls opened.", "info"); 
                  }} 
                  className="transition hover:text-[#c8a45a]" 
                > 
                  Security 
                </button> 
 
                <button 
                  type="button" 
                  onClick={() => { 
                    setActiveTab("profile"); 
                    showToast("Account controls opened.", "info"); 
                  }} 
                  className="transition hover:text-[#c8a45a]" 
                > 
                  Account 
                </button> 
              </div> 
            </footer> 
          </main> 
        </div> 
      </div> 
 
      {/* RESET MODAL */} 
      {showResetConfirm && ( 
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl"> 
          <div className="relative w-full max-w-md overflow-hidden rounded-[24px] border border-white/[0.1] bg-[#0b0a08] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.65)]"> 
            {/* ADDED: modal architectural accents */} 
            <div className="pointer-events-none absolute left-0 top-0 h-px w-24 bg-gradient-to-r from-[#e7b84b]/55 to-transparent" /> 
            <div className="pointer-events-none absolute bottom-0 right-0 h-px w-20 bg-gradient-to-l from-[#e7b84b]/25 to-transparent" /> 
 
            <div className="pointer-events-none absolute right-[-90px] top-[-100px] h-60 w-60 rounded-full bg-[#d6a94f]/[0.045] blur-[80px]" /> 
 
            <div className="relative"> 
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#d6a94f]/15 bg-[#d6a94f]/[0.06] text-[#ddb760]"> 
                <Icon name="refresh" size={19} /> 
              </div> 
 
              <p className="mt-5 font-mono text-[8px] uppercase tracking-[0.2em] text-[#a38143]"> 
                Configuration reset 
              </p> 
 
              <h3 className="mt-2 text-[19px] font-semibold tracking-tight text-[#f0ece3]"> 
                Reset all settings? 
              </h3> 
 
              <p className="mt-2 text-[12px] leading-6 text-[#666a6f]"> 
                This will restore your profile, AI, notification, appearance 
                and security preferences to their default values. 
              </p> 
 
              <div className="mt-7 flex justify-end gap-3"> 
                <button 
                  type="button" 
                  onClick={() => setShowResetConfirm(false)} 
                  className="rounded-xl border border-white/[0.08] px-4 py-2.5 text-[10px] font-semibold text-[#777b80] transition hover:bg-white/[0.04] hover:text-white" 
                > 
                  Cancel 
                </button> 
 
                <button 
                  type="button" 
                  onClick={resetAllSettings} 
                  className="rounded-xl bg-[#dfb35a] px-4 py-2.5 text-[10px] font-bold text-[#151209] transition hover:bg-[#edc46d]" 
                > 
                  Reset everything 
                </button> 
              </div> 
            </div> 
          </div> 
        </div> 
      )} 
 
      {/* DELETE MODAL */} 
      {showDeleteConfirm && ( 
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl"> 
          <div className="relative w-full max-w-md overflow-hidden rounded-[24px] border border-red-400/15 bg-[#100b0b] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.7)]"> 
            {/* ADDED: destructive-operation framing */} 
            <div className="pointer-events-none absolute left-0 top-0 h-px w-28 bg-gradient-to-r from-red-400/55 to-transparent" /> 
            <div className="pointer-events-none absolute bottom-0 right-0 h-px w-20 bg-gradient-to-l from-red-400/30 to-transparent" /> 
 
            <div className="pointer-events-none absolute right-[-90px] top-[-100px] h-60 w-60 rounded-full bg-red-500/[0.035] blur-[80px]" /> 
 
            <div className="relative"> 
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-400/15 bg-red-400/[0.06] text-red-300"> 
                <Icon name="trash" size={19} /> 
              </div> 
 
              <p className="mt-5 font-mono text-[8px] uppercase tracking-[0.2em] text-red-300/55"> 
                Destructive operation 
              </p> 
 
              <h3 className="mt-2 text-[19px] font-semibold tracking-tight text-[#f0ece3]"> 
                Delete workspace 
              </h3> 
 
              <p className="mt-2 text-[12px] leading-6 text-[#666a6f]"> 
                This is a destructive action. Type{" "} 
                <span className="font-semibold text-red-300">DELETE</span>{" "} 
                below to confirm. 
              </p> 
 
              <input 
                value={deleteText} 
                onChange={(event) => setDeleteText(event.target.value)} 
                placeholder="Type DELETE" 
                className="mt-5 h-12 w-full rounded-xl border border-red-400/15 bg-black/30 px-4 text-[12px] text-white outline-none placeholder:text-[#4d5054] transition focus:border-red-400/40" 
              /> 
 
              <div className="mt-6 flex justify-end gap-3"> 
                <button 
                  type="button" 
                  onClick={() => { 
                    setShowDeleteConfirm(false); 
                    setDeleteText(""); 
                  }} 
                  className="rounded-xl border border-white/[0.08] px-4 py-2.5 text-[10px] font-semibold text-[#777b80] transition hover:bg-white/[0.04] hover:text-white" 
                > 
                  Cancel 
                </button> 
 
                <button 
                  type="button" 
                  onClick={deleteWorkspace} 
                  className="rounded-xl bg-red-500 px-4 py-2.5 text-[10px] font-bold text-white transition hover:bg-red-400" 
                > 
                  Confirm deletion 
                </button> 
              </div> 
            </div> 
          </div> 
        </div> 
      )} 
 
      {/* TOAST */} 
      {toast && ( 
        <div className="fixed bottom-5 right-5 z-[60] w-[min(390px,calc(100vw-2rem))]"> 
          <div 
            className={`relative overflow-hidden rounded-[18px] border p-4 shadow-[0_25px_90px_rgba(0,0,0,0.5)] backdrop-blur-2xl ${ 
              toast.type === "success" 
                ? "border-emerald-400/15 bg-[#09120d]/95" 
                : toast.type === "error" 
                  ? "border-red-400/15 bg-[#150909]/95" 
                  : "border-[#d6a94f]/15 bg-[#11100d]/95" 
            }`} 
          > 
            {/* ADDED: toast signal glow */} 
            <div 
              className={`pointer-events-none absolute right-[-30px] top-[-40px] h-24 w-24 rounded-full blur-2xl ${ 
                toast.type === "success" 
                  ? "bg-emerald-400/[0.06]" 
                  : toast.type === "error" 
                    ? "bg-red-400/[0.06]" 
                    : "bg-[#d6a94f]/[0.06]" 
              }`} 
            /> 
 
            <div 
              className={`absolute left-0 top-0 h-full w-[2px] ${ 
                toast.type === "success" 
                  ? "bg-emerald-400" 
                  : toast.type === "error" 
                    ? "bg-red-400" 
                    : "bg-[#d6a94f]" 
              }`} 
            /> 
 
            <div className="flex items-start gap-3"> 
              <div 
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${ 
                  toast.type === "success" 
                    ? "bg-emerald-400/10 text-emerald-300" 
                    : toast.type === "error" 
                      ? "bg-red-400/10 text-red-300" 
                      : "bg-[#d6a94f]/10 text-[#dfba6a]" 
                }`} 
              > 
                {toast.type === "success" ? ( 
                  <Icon name="check" size={14} /> 
                ) : toast.type === "error" ? ( 
                  <span className="text-xs font-bold">!</span> 
                ) : ( 
                  <span className="text-xs font-bold">i</span> 
                )} 
              </div> 
 
              <div> 
                <p className="text-[8px] font-bold uppercase tracking-[0.17em] text-[#55595d]"> 
                  NexaFlow 
                </p> 
 
                <p className="mt-1 text-[11px] leading-5 text-[#d0cec8]"> 
                  {toast.message} 
                </p> 
              </div> 
            </div> 
          </div> 
        </div> 
      )} 
    </div> 
  ); 
} 

           