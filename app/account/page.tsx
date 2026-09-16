"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";

import Link from "next/link";

type PlanKey = "starter" | "growth" | "scale";

type ProfileData = {
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  company: string;
  location: string;
  bio: string;
  website: string;
  linkedin: string;
  github: string;
};

type PaymentRecord = {
  id: string;
  date: string;
  plan: string;
  method: string;
  amount: string;
  status: "Paid" | "Free";
};

const PROFILE_KEY = "nexaflow-profile";
const PROFILE_IMAGE_KEY = "nexaflow-profile-image";
const PLAN_KEY = "nexaflow-current-plan";
const PAYMENTS_KEY = "nexaflow-payments";
const NOTIFICATIONS_KEY = "nexaflow-notifications";

const planDetails: Record<
  PlanKey,
  {
    name: string;
    price: number;
    period: string;
    description: string;
    features: string[];
  }
> = {
  starter: {
    name: "Starter",
    price: 0,
    period: "forever",
    description: "For exploring AI-powered automation.",
    features: [
      "Basic AI assistance",
      "3 workflows",
      "100 AI actions / month",
      "Basic task management",
      "Workflow activity",
    ],
  },
  growth: {
    name: "Growth",
    price: 29,
    period: "per month",
    description: "For businesses ready to automate more.",
    features: [
      "Advanced AI workflows",
      "Unlimited workflows",
      "1,000 AI actions / month",
      "Lead management",
      "Analytics dashboard",
      "Priority workflow execution",
    ],
  },
  scale: {
    name: "Scale",
    price: 79,
    period: "per month",
    description: "For teams with more complex automation needs.",
    features: [
      "Everything in Growth",
      "5,000 AI actions / month",
      "Advanced analytics",
      "Team workflows",
      "Custom automation logic",
      "Higher usage limits",
    ],
  },
};

const initialProfile: ProfileData = {
  fullName: "",
  email: "",
  phone: "",
  jobTitle: "",
  company: "",
  location: "",
  bio: "",
  website: "",
  linkedin: "",
  github: "",
};

const initialPayments: PaymentRecord[] = [
  {
    id: "NF-DEMO-001",
    date: "Demo account",
    plan: "Starter",
    method: "Free",
    amount: "$0.00",
    status: "Free",
  },
];

export default function AccountPage() {
  const [profile, setProfile] =
    useState<ProfileData>(initialProfile);

  const [savedProfile, setSavedProfile] =
    useState<ProfileData>(initialProfile);

  const [editingPersonal, setEditingPersonal] =
    useState(false);

  const [editingProfessional, setEditingProfessional] =
    useState(false);

  const [savedMessage, setSavedMessage] =
    useState(false);

  const [profileImage, setProfileImage] =
    useState<string | null>(null);

  const [currentPlan, setCurrentPlan] =
    useState<PlanKey>("starter");

  const [payments, setPayments] =
    useState<PaymentRecord[]>(initialPayments);

  const [emailNotifications, setEmailNotifications] =
    useState(true);

  const [workflowNotifications, setWorkflowNotifications] =
    useState(true);

  const [aiNotifications, setAiNotifications] =
    useState(true);

  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  const [securityModal, setSecurityModal] = useState<
    "email" | "password" | "sessions" | null
  >(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [hydrated, setHydrated] = useState(false);

  const currentPlanDetails = planDetails[currentPlan];

  /*
   * --------------------------------------------------------------------------
   * Load saved account data
   * --------------------------------------------------------------------------
   */

  useEffect(() => {
    try {
      const storedProfile =
        window.localStorage.getItem(PROFILE_KEY);

      if (storedProfile) {
        const parsedProfile = JSON.parse(
          storedProfile
        ) as ProfileData;

        setProfile({
          ...initialProfile,
          ...parsedProfile,
        });

        setSavedProfile({
          ...initialProfile,
          ...parsedProfile,
        });
      }

      const storedImage =
        window.localStorage.getItem(PROFILE_IMAGE_KEY);

      if (storedImage) {
        setProfileImage(storedImage);
      }

      const storedPlan =
        window.localStorage.getItem(PLAN_KEY);

      if (
        storedPlan === "starter" ||
        storedPlan === "growth" ||
        storedPlan === "scale"
      ) {
        setCurrentPlan(storedPlan);
      }

      const storedPayments =
        window.localStorage.getItem(PAYMENTS_KEY);

      if (storedPayments) {
        const parsedPayments = JSON.parse(
          storedPayments
        ) as PaymentRecord[];

        if (Array.isArray(parsedPayments)) {
          setPayments(parsedPayments);
        }
      }

      const storedNotifications =
        window.localStorage.getItem(
          NOTIFICATIONS_KEY
        );

      if (storedNotifications) {
        const parsedNotifications = JSON.parse(
          storedNotifications
        ) as {
          email: boolean;
          workflow: boolean;
          ai: boolean;
        };

        setEmailNotifications(
          parsedNotifications.email
        );

        setWorkflowNotifications(
          parsedNotifications.workflow
        );

        setAiNotifications(parsedNotifications.ai);
      }
    } catch {
      // Keep default demo state if localStorage contains invalid data.
    }

    setHydrated(true);
  }, []);

  /*
   * --------------------------------------------------------------------------
   * Persist notifications
   * --------------------------------------------------------------------------
   */

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(
      NOTIFICATIONS_KEY,
      JSON.stringify({
        email: emailNotifications,
        workflow: workflowNotifications,
        ai: aiNotifications,
      })
    );
  }, [
    emailNotifications,
    workflowNotifications,
    aiNotifications,
    hydrated,
  ]);

  /*
   * --------------------------------------------------------------------------
   * Profile completion
   * --------------------------------------------------------------------------
   */

  const completion = useMemo(() => {
    const fields = [
      profile.fullName,
      profile.email,
      profile.phone,
      profile.jobTitle,
      profile.company,
      profile.location,
      profile.bio,
      profile.website,
      profile.linkedin,
      profile.github,
    ];

    const completed = fields.filter(
      (field) => field.trim().length > 0
    ).length;

    return Math.round(
      (completed / fields.length) * 100
    );
  }, [profile]);

  const initials = useMemo(() => {
    if (!profile.fullName.trim()) {
      return "U";
    }

    return profile.fullName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }, [profile.fullName]);

  /*
   * --------------------------------------------------------------------------
   * Profile helpers
   * --------------------------------------------------------------------------
   */

  const updateProfile = (
    field: keyof ProfileData,
    value: string
  ) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleProfileImage = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfileImage(reader.result);

        window.localStorage.setItem(
          PROFILE_IMAGE_KEY,
          reader.result
        );

        window.dispatchEvent(
          new Event(
            "nexaflow-profile-image-updated"
          )
        );
      }
    };

    reader.readAsDataURL(file);

    event.target.value = "";
  };

  const handleSavePersonal = () => {
    const nextProfile = {
      ...savedProfile,
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone,
      jobTitle: profile.jobTitle,
      company: profile.company,
      location: profile.location,
    };

    setProfile(nextProfile);
    setSavedProfile(nextProfile);

    window.localStorage.setItem(
      PROFILE_KEY,
      JSON.stringify(nextProfile)
    );

    setEditingPersonal(false);
    showSavedMessage();
  };

  const handleSaveProfessional = () => {
    const nextProfile = {
      ...savedProfile,
      bio: profile.bio,
      website: profile.website,
      linkedin: profile.linkedin,
      github: profile.github,
    };

    setProfile(nextProfile);
    setSavedProfile(nextProfile);

    window.localStorage.setItem(
      PROFILE_KEY,
      JSON.stringify(nextProfile)
    );

    setEditingProfessional(false);
    showSavedMessage();
  };

  const handleCancelPersonal = () => {
    setProfile(savedProfile);
    setEditingPersonal(false);
  };

  const handleCancelProfessional = () => {
    setProfile(savedProfile);
    setEditingProfessional(false);
  };

  const showSavedMessage = () => {
    setSavedMessage(true);

    window.setTimeout(() => {
      setSavedMessage(false);
    }, 2500);
  };

  /*
   * --------------------------------------------------------------------------
   * Logout
   * --------------------------------------------------------------------------
   */

  const handleLogout = () => {
    window.location.href = "/login";
  };

  /*
   * --------------------------------------------------------------------------
   * Plans
   * --------------------------------------------------------------------------
   */

  const handlePlanChange = (plan: PlanKey) => {
    if (plan === currentPlan) {
      return;
    }

    window.localStorage.setItem(
      PLAN_KEY,
      plan
    );

    window.location.href = `/payment?plan=${plan}`;
  };

  /*
   * --------------------------------------------------------------------------
   * Security actions
   * --------------------------------------------------------------------------
   */

  const handlePasswordChange = () => {
    if (!password || !confirmPassword) {
      alert("Please enter your new password.");
      return;
    }

    if (password.length < 8) {
      alert(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setPassword("");
    setConfirmPassword("");
    setSecurityModal(null);

    alert(
      "Password changed successfully in demo mode."
    );
  };

  /*
   * --------------------------------------------------------------------------
   * Delete
   * --------------------------------------------------------------------------
   */

  const handleDeleteDemoAccount = () => {
    window.localStorage.removeItem(PROFILE_KEY);
    window.localStorage.removeItem(PROFILE_IMAGE_KEY);
    window.localStorage.removeItem(PLAN_KEY);
    window.localStorage.removeItem(PAYMENTS_KEY);
    window.localStorage.removeItem(
      NOTIFICATIONS_KEY
    );

    setProfile(initialProfile);
    setSavedProfile(initialProfile);
    setProfileImage(null);
    setCurrentPlan("starter");
    setPayments(initialPayments);

    setShowDeleteConfirm(false);

    window.dispatchEvent(
      new Event("nexaflow-profile-image-updated")
    );

    alert(
      "Demo account data has been cleared."
    );
  };

  const fullProfileName =
    savedProfile.fullName || "NexaFlow User";

  const accountEmail =
    savedProfile.email || "your@email.com";

  return (
    <main className="min-h-screen bg-[#151713] text-[#F4F0E6]">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-[500px] w-[500px] rounded-full bg-[#E7B84B]/7 blur-[140px]" />

        <div className="absolute -bottom-48 -right-48 h-[550px] w-[550px] rounded-full bg-[#E7B84B]/5 blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E7B84B]/20 bg-[#E7B84B]/5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#F5D98B]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0] shadow-[0_0_10px_rgba(94,214,160,0.8)]" />

              Account Center
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Your account
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#9A9D94]">
              Manage your profile, subscription, payment
              history, security and NexaFlow preferences
              from one place.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-[#C8CBC1] transition hover:border-[#E7B84B]/30 hover:bg-[#E7B84B]/5 hover:text-[#F5D98B]"
            >
              ← Dashboard
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-[#E87575]/20 bg-[#E87575]/5 px-4 py-2.5 text-sm text-[#E87575] transition hover:border-[#E87575]/40 hover:bg-[#E87575]/10"
            >
              Log out
            </button>
          </div>
        </div>

        {/* Profile completion */}
        <div className="mb-6 overflow-hidden rounded-3xl border border-[#E7B84B]/20 bg-[#1B1F19]/90 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#E7B84B]/20 bg-[#E7B84B]/5 text-lg">
                ✦
              </div>

              <div>
                <p className="text-sm font-semibold">
                  {completion === 100
                    ? "Profile complete"
                    : "Complete your profile"}
                </p>

                <p className="mt-1 text-xs leading-5 text-[#858980]">
                  {completion === 100
                    ? "Your NexaFlow profile is fully completed."
                    : "Add your information so your NexaFlow workspace feels complete and personalized."}
                </p>
              </div>
            </div>

            <div className="w-full md:max-w-xs">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-[#9A9D94]">
                  Profile completion
                </span>

                <span className="font-semibold text-[#F5D98B]">
                  {completion}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-[#E7B84B] transition-all duration-500"
                  style={{
                    width: `${completion}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          {/* Profile card */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/8 bg-[#1B1F19]/90 p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#9A9D94]">
                    Profile
                  </p>

                  <h2 className="mt-1 text-lg font-semibold">
                    Personal identity
                  </h2>
                </div>

                {!editingPersonal ? (
                  <button
                    type="button"
                    onClick={() =>
                      setEditingPersonal(true)
                    }
                    className="rounded-xl border border-[#E7B84B]/20 bg-[#E7B84B]/5 px-3.5 py-2 text-xs font-medium text-[#F5D98B] transition hover:border-[#E7B84B]/40 hover:bg-[#E7B84B]/10"
                  >
                    Edit profile
                  </button>
                ) : null}
              </div>

              {/* Profile image */}
              <div className="flex flex-col items-center">
                <label className="group relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleProfileImage}
                  />

                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-[#E7B84B]/30 bg-[#20241D] shadow-[0_0_45px_rgba(231,184,75,0.12)] transition group-hover:border-[#E7B84B]/70 group-hover:shadow-[0_0_55px_rgba(231,184,75,0.2)]">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-semibold text-[#E7B84B]">
                        {initials}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-[#151713] bg-[#E7B84B] text-sm text-[#151713] shadow-lg">
                    +
                  </div>
                </label>

                <p className="mt-3 text-xs text-[#858980]">
                  Click your photo to browse
                </p>

                <p className="mt-1 text-[10px] text-[#656960]">
                  JPG, PNG or WEBP
                </p>
              </div>

              {/* Personal fields */}
              <div className="mt-7 space-y-4">
                <ProfileField
                  label="Full name"
                  value={profile.fullName}
                  placeholder="Your full name"
                  editing={editingPersonal}
                  onChange={(value) =>
                    updateProfile(
                      "fullName",
                      value
                    )
                  }
                />

                <ProfileField
                  label="Email address"
                  value={profile.email}
                  placeholder="you@example.com"
                  type="email"
                  editing={editingPersonal}
                  onChange={(value) =>
                    updateProfile(
                      "email",
                      value
                    )
                  }
                />

                <ProfileField
                  label="Phone"
                  value={profile.phone}
                  placeholder="+92 xxx xxxxxxx"
                  editing={editingPersonal}
                  onChange={(value) =>
                    updateProfile(
                      "phone",
                      value
                    )
                  }
                />

                <ProfileField
                  label="Job title"
                  value={profile.jobTitle}
                  placeholder="Full-Stack Engineer"
                  editing={editingPersonal}
                  onChange={(value) =>
                    updateProfile(
                      "jobTitle",
                      value
                    )
                  }
                />

                <ProfileField
                  label="Company"
                  value={profile.company}
                  placeholder="Company / Organization"
                  editing={editingPersonal}
                  onChange={(value) =>
                    updateProfile(
                      "company",
                      value
                    )
                  }
                />

                <ProfileField
                  label="Location"
                  value={profile.location}
                  placeholder="City, Country"
                  editing={editingPersonal}
                  onChange={(value) =>
                    updateProfile(
                      "location",
                      value
                    )
                  }
                />
              </div>

              {editingPersonal ? (
                <div className="mt-7 flex flex-col gap-3 border-t border-white/8 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={
                      handleCancelPersonal
                    }
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm text-[#9A9D94] transition hover:bg-white/[0.06] hover:text-[#F4F0E6]"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleSavePersonal
                    }
                    className="rounded-xl bg-[#E7B84B] px-5 py-2.5 text-sm font-semibold text-[#151713] shadow-[0_0_30px_rgba(231,184,75,0.15)] transition hover:bg-[#F5D98B] hover:shadow-[0_0_40px_rgba(231,184,75,0.25)]"
                  >
                    Save changes
                  </button>
                </div>
              ) : null}
            </div>

            {/* Account status */}
            <div className="rounded-3xl border border-white/8 bg-[#1B1F19]/90 p-6 shadow-2xl backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.18em] text-[#9A9D94]">
                Account status
              </p>

              <div className="mt-5 space-y-4">
                <StatusRow
                  label="Account"
                  value="Active"
                  status="success"
                />

                <StatusRow
                  label="Email"
                  value={
                    profile.email
                      ? "Provided"
                      : "Not completed"
                  }
                  status={
                    profile.email
                      ? "success"
                      : "warning"
                  }
                />

                <StatusRow
                  label="Profile"
                  value={`${completion}% complete`}
                  status={
                    completion >= 80
                      ? "success"
                      : "warning"
                  }
                />

                <StatusRow
                  label="Plan"
                  value={currentPlanDetails.name}
                  status="success"
                />
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="space-y-6">
            {/* Professional information */}
            <div className="rounded-3xl border border-white/8 bg-[#1B1F19]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-7">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#9A9D94]">
                    About you
                  </p>

                  <h2 className="mt-1 text-xl font-semibold">
                    Professional profile
                  </h2>

                  <p className="mt-2 text-xs leading-5 text-[#858980]">
                    Tell NexaFlow about your professional
                    background and online presence.
                  </p>
                </div>

                {!editingProfessional ? (
                  <button
                    type="button"
                    onClick={() =>
                      setEditingProfessional(true)
                    }
                    className="shrink-0 rounded-xl border border-[#E7B84B]/20 bg-[#E7B84B]/5 px-3.5 py-2 text-xs font-medium text-[#F5D98B] transition hover:border-[#E7B84B]/40 hover:bg-[#E7B84B]/10"
                  >
                    Edit professional profile
                  </button>
                ) : null}
              </div>

              {/* Bio */}
              <div>
                <label className="text-xs font-medium text-[#C8CBC1]">
                  Bio
                </label>

                {editingProfessional ? (
                  <textarea
                    value={profile.bio}
                    onChange={(event) =>
                      updateProfile(
                        "bio",
                        event.target.value
                      )
                    }
                    placeholder="Tell us about yourself, your role and what you use NexaFlow for..."
                    rows={5}
                    className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-[#151713] px-4 py-3 text-sm text-[#F4F0E6] outline-none transition placeholder:text-[#5F625A] focus:border-[#E7B84B]/40 focus:ring-2 focus:ring-[#E7B84B]/10"
                  />
                ) : (
                  <div className="mt-2 min-h-28 rounded-2xl border border-white/8 bg-[#151713]/70 p-4 text-sm leading-7 text-[#9A9D94]">
                    {profile.bio ||
                      "No bio added yet. Click Edit professional profile to tell us about yourself."}
                  </div>
                )}
              </div>

              {/* Professional links */}
              <div className="mt-7">
                <p className="mb-4 text-xs uppercase tracking-[0.16em] text-[#858980]">
                  Professional links
                </p>

                <div className="grid gap-4 sm:grid-cols-3">
                  <LinkField
                    label="Website"
                    value={profile.website}
                    placeholder="https://yourwebsite.com"
                    editing={
                      editingProfessional
                    }
                    onChange={(value) =>
                      updateProfile(
                        "website",
                        value
                      )
                    }
                    icon="↗"
                  />

                  <LinkField
                    label="LinkedIn"
                    value={profile.linkedin}
                    placeholder="https://linkedin.com/in/..."
                    editing={
                      editingProfessional
                    }
                    onChange={(value) =>
                      updateProfile(
                        "linkedin",
                        value
                      )
                    }
                    icon="in"
                  />

                  <LinkField
                    label="GitHub"
                    value={profile.github}
                    placeholder="https://github.com/..."
                    editing={
                      editingProfessional
                    }
                    onChange={(value) =>
                      updateProfile(
                        "github",
                        value
                      )
                    }
                    icon="⌘"
                  />
                </div>
              </div>

              {editingProfessional ? (
                <div className="mt-7 flex flex-col gap-3 border-t border-white/8 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={
                      handleCancelProfessional
                    }
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm text-[#9A9D94] transition hover:bg-white/[0.06] hover:text-[#F4F0E6]"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleSaveProfessional
                    }
                    className="rounded-xl bg-[#E7B84B] px-5 py-2.5 text-sm font-semibold text-[#151713] shadow-[0_0_30px_rgba(231,184,75,0.15)] transition hover:bg-[#F5D98B] hover:shadow-[0_0_40px_rgba(231,184,75,0.25)]"
                  >
                    Save professional profile
                  </button>
                </div>
              ) : null}

              {savedMessage ? (
                <div className="mt-4 rounded-xl border border-[#5ED6A0]/20 bg-[#5ED6A0]/5 px-4 py-3 text-xs text-[#5ED6A0]">
                  ✓ Profile changes saved successfully.
                </div>
              ) : null}
            </div>

            {/* Subscription */}
            <div className="rounded-3xl border border-white/8 bg-[#1B1F19]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#9A9D94]">
                    Subscription
                  </p>

                  <h2 className="mt-1 text-xl font-semibold">
                    Your NexaFlow plan
                  </h2>
                </div>

                <div className="rounded-full border border-[#5ED6A0]/20 bg-[#5ED6A0]/5 px-3 py-1.5 text-xs text-[#5ED6A0]">
                  ● Active
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-[#E7B84B]/20 bg-[#E7B84B]/5 p-5">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold">
                        {currentPlanDetails.name}
                      </span>

                      {currentPlan ===
                        "growth" && (
                        <span className="rounded-full bg-[#E7B84B]/15 px-2 py-0.5 text-[9px] uppercase tracking-wider text-[#F5D98B]">
                          Popular
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-[#858980]">
                      {
                        currentPlanDetails.description
                      }
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-2xl font-semibold text-[#F5D98B]">
                      {currentPlanDetails.price ===
                      0
                        ? "Free"
                        : `$${currentPlanDetails.price}`}
                    </p>

                    <p className="text-[10px] text-[#858980]">
                      {
                        currentPlanDetails.period
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Current benefits */}
              <div className="mt-6">
                <p className="mb-4 text-xs uppercase tracking-[0.16em] text-[#858980]">
                  Included benefits
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {currentPlanDetails.features.map(
                    (feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-3.5 py-3"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#5ED6A0]/10 text-[10px] text-[#5ED6A0]">
                          ✓
                        </span>

                        <span className="text-xs text-[#B5B8AF]">
                          {feature}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Plan choices */}
              <div className="mt-7 grid gap-3 md:grid-cols-3">
                {(
                  Object.keys(
                    planDetails
                  ) as PlanKey[]
                ).map((planKey) => {
                  const item =
                    planDetails[planKey];

                  const active =
                    currentPlan === planKey;

                  return (
                    <div
                      key={planKey}
                      className={`rounded-2xl border p-4 transition ${
                        active
                          ? "border-[#E7B84B]/45 bg-[#E7B84B]/5"
                          : "border-white/8 bg-white/[0.02]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-[#858980]">
                            {item.price === 0
                              ? "Free"
                              : `$${item.price}/month`}
                          </p>
                        </div>

                        {active && (
                          <span className="text-[9px] uppercase tracking-wider text-[#5ED6A0]">
                            Current
                          </span>
                        )}
                      </div>

                      <ul className="mt-4 space-y-2">
                        {item.features
                          .slice(0, 4)
                          .map((feature) => (
                            <li
                              key={feature}
                              className="flex gap-2 text-[10px] leading-4 text-[#858980]"
                            >
                              <span className="text-[#E7B84B]">
                                ✓
                              </span>

                              {feature}
                            </li>
                          ))}
                      </ul>

                      <button
                        type="button"
                        onClick={() =>
                          handlePlanChange(
                            planKey
                          )
                        }
                        disabled={active}
                        className={`mt-4 w-full rounded-xl px-3 py-2 text-xs font-medium transition ${
                          active
                            ? "cursor-default bg-white/5 text-[#656960]"
                            : "border border-[#E7B84B]/20 bg-[#E7B84B]/5 text-[#F5D98B] hover:border-[#E7B84B]/40 hover:bg-[#E7B84B]/10"
                        }`}
                      >
                        {active
                          ? "Current plan"
                          : "Choose plan"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Billing */}
            <div className="rounded-3xl border border-white/8 bg-[#1B1F19]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#9A9D94]">
                    Billing
                  </p>

                  <h2 className="mt-1 text-xl font-semibold">
                    Payment details
                  </h2>

                  <p className="mt-2 text-xs text-[#858980]">
                    Your subscription and transaction
                    information.
                  </p>
                </div>

                <Link
                  href={`/payment?plan=${currentPlan}`}
                  className="rounded-xl border border-[#E7B84B]/20 bg-[#E7B84B]/5 px-4 py-2.5 text-xs font-medium text-[#F5D98B] transition hover:border-[#E7B84B]/40 hover:bg-[#E7B84B]/10"
                >
                  Manage payment →
                </Link>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <BillingStat
                  label="Current plan"
                  value={
                    currentPlanDetails.name
                  }
                />

                <BillingStat
                  label="Amount"
                  value={
                    currentPlanDetails.price ===
                    0
                      ? "Free"
                      : `$${currentPlanDetails.price}/mo`
                  }
                />

                <BillingStat
                  label="Billing status"
                  value={
                    currentPlanDetails.price ===
                    0
                      ? "No payment"
                      : "Active"
                  }
                />
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-white/8">
                <div className="hidden grid-cols-[1.3fr_1fr_1fr_0.7fr] border-b border-white/8 bg-white/[0.02] px-4 py-3 text-[10px] uppercase tracking-wider text-[#656960] sm:grid">
                  <span>Transaction</span>
                  <span>Plan</span>
                  <span>Method</span>
                  <span className="text-right">
                    Amount
                  </span>
                </div>

                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="grid gap-3 border-b border-white/8 px-4 py-4 last:border-b-0 sm:grid-cols-[1.3fr_1fr_1fr_0.7fr] sm:items-center"
                  >
                    <div>
                      <p className="text-xs font-medium">
                        {payment.id}
                      </p>

                      <p className="mt-1 text-[10px] text-[#656960]">
                        {payment.date}
                      </p>
                    </div>

                    <span className="text-xs text-[#9A9D94]">
                      {payment.plan}
                    </span>

                    <span className="text-xs text-[#9A9D94]">
                      {payment.method}
                    </span>

                    <div className="text-left sm:text-right">
                      <p className="text-xs font-semibold text-[#F5D98B]">
                        {payment.amount}
                      </p>

                      <p
                        className={`mt-1 text-[9px] ${
                          payment.status ===
                          "Paid"
                            ? "text-[#5ED6A0]"
                            : "text-[#858980]"
                        }`}
                      >
                        {payment.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="rounded-3xl border border-white/8 bg-[#1B1F19]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-7">
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.18em] text-[#9A9D94]">
                  Security
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  Account security
                </h2>
              </div>

              <div className="space-y-3">
                <SecurityRow
                  icon="✉"
                  title="Email verification"
                  description={
                    profile.email
                      ? "Your account email is configured."
                      : "Add an email address to complete your account."
                  }
                  action="Manage"
                  onClick={() =>
                    setSecurityModal(
                      "email"
                    )
                  }
                />

                <SecurityRow
                  icon="•••"
                  title="Password"
                  description="Keep your account protected with a strong password."
                  action="Change"
                  onClick={() =>
                    setSecurityModal(
                      "password"
                    )
                  }
                />

                <SecurityRow
                  icon="◉"
                  title="Active sessions"
                  description="Review where your NexaFlow account is currently active."
                  action="Review"
                  onClick={() =>
                    setSecurityModal(
                      "sessions"
                    )
                  }
                />
              </div>
            </div>

            {/* Preferences */}
            <div className="rounded-3xl border border-white/8 bg-[#1B1F19]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-7">
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.18em] text-[#9A9D94]">
                  Preferences
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  Notifications
                </h2>
              </div>

              <div className="space-y-4">
                <ToggleRow
                  title="Email notifications"
                  description="Receive important account and billing updates."
                  enabled={
                    emailNotifications
                  }
                  onChange={
                    setEmailNotifications
                  }
                />

                <ToggleRow
                  title="Workflow notifications"
                  description="Get notified when your automations complete or need attention."
                  enabled={
                    workflowNotifications
                  }
                  onChange={
                    setWorkflowNotifications
                  }
                />

                <ToggleRow
                  title="AI activity notifications"
                  description="Receive updates about AI actions and automation activity."
                  enabled={
                    aiNotifications
                  }
                  onChange={
                    setAiNotifications
                  }
                />
              </div>
            </div>

            {/* Danger zone */}
            <div className="rounded-3xl border border-[#E87575]/15 bg-[#1B1F19]/90 p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#E87575]">
                    Danger zone
                  </p>

                  <h2 className="mt-1 text-lg font-semibold">
                    Delete account
                  </h2>

                  <p className="mt-1 max-w-xl text-xs leading-5 text-[#858980]">
                    Permanently remove your account and
                    associated workspace data. This action
                    cannot be undone.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowDeleteConfirm(
                      (current) => !current
                    )
                  }
                  className="shrink-0 rounded-xl border border-[#E87575]/20 bg-[#E87575]/5 px-4 py-2.5 text-xs font-medium text-[#E87575] transition hover:border-[#E87575]/40 hover:bg-[#E87575]/10"
                >
                  Delete account
                </button>
              </div>

              {showDeleteConfirm ? (
                <div className="mt-5 rounded-2xl border border-[#E87575]/20 bg-[#E87575]/5 p-4">
                  <p className="text-sm font-medium text-[#F4F0E6]">
                    Are you sure you want to delete
                    your account?
                  </p>

                  <p className="mt-1 text-xs text-[#9A9D94]">
                    This demo will clear the locally
                    stored NexaFlow account data from
                    this browser.
                  </p>

                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setShowDeleteConfirm(
                          false
                        )
                      }
                      className="rounded-xl border border-white/10 px-4 py-2 text-xs text-[#9A9D94] hover:bg-white/[0.04]"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={
                        handleDeleteDemoAccount
                      }
                      className="rounded-xl bg-[#E87575] px-4 py-2 text-xs font-semibold text-[#151713]"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 border-t border-white/8 pt-6 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#656960]">
            NEXAFLOW / ACCOUNT CENTER
          </p>

          <p className="mt-2 text-xs text-[#555850]">
            Manage your AI operations identity,
            subscription and preferences.
          </p>
        </div>
      </section>

      {/* Security modal */}
      {securityModal ? (
        <SecurityModal
          type={securityModal}
          email={accountEmail}
          password={password}
          confirmPassword={confirmPassword}
          setPassword={setPassword}
          setConfirmPassword={
            setConfirmPassword
          }
          onClose={() =>
            setSecurityModal(null)
          }
          onPasswordChange={
            handlePasswordChange
          }
          onEmailSaved={() => {
            setSecurityModal(null);
            showSavedMessage();
          }}
        />
      ) : null}
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Profile Field                                                              */
/* -------------------------------------------------------------------------- */

function ProfileField({
  label,
  value,
  placeholder,
  type = "text",
  editing,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  type?: string;
  editing: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-[#C8CBC1]">
        {label}
      </label>

      {editing ? (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="mt-2 w-full rounded-xl border border-white/10 bg-[#151713] px-4 py-3 text-sm text-[#F4F0E6] outline-none transition placeholder:text-[#5F625A] focus:border-[#E7B84B]/40 focus:ring-2 focus:ring-[#E7B84B]/10"
        />
      ) : (
        <div className="mt-2 rounded-xl border border-white/8 bg-[#151713]/70 px-4 py-3 text-sm text-[#9A9D94]">
          {value || (
            <span className="text-[#555850]">
              {placeholder}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Link Field                                                                 */
/* -------------------------------------------------------------------------- */

function normalizeUrl(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function LinkField({
  label,
  value,
  placeholder,
  editing,
  onChange,
  icon,
}: {
  label: string;
  value: string;
  placeholder: string;
  editing: boolean;
  onChange: (value: string) => void;
  icon: string;
}) {
  const normalizedUrl = normalizeUrl(value);

  return (
    <div>
      <label className="flex items-center gap-2 text-xs font-medium text-[#C8CBC1]">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#E7B84B]/10 text-[10px] text-[#E7B84B]">
          {icon}
        </span>

        {label}
      </label>

      {editing ? (
        <>
          <input
            type="url"
            value={value}
            placeholder={placeholder}
            onChange={(event) =>
              onChange(event.target.value)
            }
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#151713] px-3 py-2.5 text-xs text-[#F4F0E6] outline-none transition placeholder:text-[#5F625A] focus:border-[#E7B84B]/40 focus:ring-2 focus:ring-[#E7B84B]/10"
          />

          {normalizedUrl ? (
            <a
              href={normalizedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block truncate text-[10px] text-[#F5D98B] underline decoration-[#E7B84B]/30 underline-offset-4 transition hover:text-[#E7B84B]"
            >
              {normalizedUrl} ↗
            </a>
          ) : null}
        </>
      ) : normalizedUrl ? (
        <div className="mt-2">
          <a
            href={normalizedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate rounded-xl border border-white/8 bg-[#151713]/70 px-3 py-2.5 text-xs text-[#F5D98B] transition hover:border-[#E7B84B]/30 hover:bg-[#E7B84B]/5"
          >
            {normalizedUrl}
          </a>

          <a
            href={normalizedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex text-[10px] text-[#858980] transition hover:text-[#F5D98B]"
          >
            Open {label} in new tab ↗
          </a>
        </div>
      ) : (
        <div className="mt-2 rounded-xl border border-white/8 bg-[#151713]/70 px-3 py-2.5 text-xs text-[#555850]">
          Not added
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Status Row                                                                 */
/* -------------------------------------------------------------------------- */

function StatusRow({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status: "success" | "warning";
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/8 pb-3 last:border-0 last:pb-0">
      <span className="text-xs text-[#858980]">
        {label}
      </span>

      <span
        className={`flex items-center gap-1.5 text-xs ${
          status === "success"
            ? "text-[#5ED6A0]"
            : "text-[#E7B84B]"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            status === "success"
              ? "bg-[#5ED6A0]"
              : "bg-[#E7B84B]"
          }`}
        />

        {value}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Billing Stat                                                               */
/* -------------------------------------------------------------------------- */

function BillingStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
      <p className="text-[10px] uppercase tracking-wider text-[#656960]">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-[#F5D98B]">
        {value}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Security Row                                                               */
/* -------------------------------------------------------------------------- */

function SecurityRow({
  icon,
  title,
  description,
  action,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/8 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-[#151713] text-xs text-[#E7B84B]">
          {icon}
        </div>

        <div>
          <p className="text-sm font-medium">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-[#858980]">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClick}
        className="rounded-xl border border-white/10 px-3 py-2 text-xs text-[#9A9D94] transition hover:border-[#E7B84B]/20 hover:text-[#F5D98B]"
      >
        {action}
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Toggle Row                                                                 */
/* -------------------------------------------------------------------------- */

function ToggleRow({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-2xl border border-white/8 bg-white/[0.02] p-4">
      <div>
        <p className="text-sm font-medium">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-[#858980]">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!enabled)}
        aria-label={`Toggle ${title}`}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled
            ? "bg-[#E7B84B]"
            : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-[#F4F0E6] transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Security Modal                                                             */
/* -------------------------------------------------------------------------- */

function SecurityModal({
  type,
  email,
  password,
  confirmPassword,
  setPassword,
  setConfirmPassword,
  onClose,
  onPasswordChange,
  onEmailSaved,
}: {
  type: "email" | "password" | "sessions";
  email: string;
  password: string;
  confirmPassword: string;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  onClose: () => void;
  onPasswordChange: () => void;
  onEmailSaved: () => void;
}) {
  const [newEmail, setNewEmail] =
    useState(email);

  const title =
    type === "email"
      ? "Email verification"
      : type === "password"
        ? "Change password"
        : "Active sessions";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-5 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-3xl border border-[#E7B84B]/20 bg-[#1B1F19] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.5)] sm:p-7">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#9A9D94]">
              Account security
            </p>

            <h3 className="mt-1 text-xl font-semibold">
              {title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-[#9A9D94] transition hover:border-white/20 hover:text-[#F4F0E6]"
          >
            ×
          </button>
        </div>

        {type === "email" ? (
          <div className="mt-6">
            <p className="text-sm leading-6 text-[#9A9D94]">
              Manage the email address associated
              with your NexaFlow account.
            </p>

            <label className="mt-5 block text-xs font-medium text-[#C8CBC1]">
              Account email
            </label>

            <input
              type="email"
              value={newEmail}
              onChange={(event) =>
                setNewEmail(
                  event.target.value
                )
              }
              placeholder="you@example.com"
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#151713] px-4 py-3 text-sm text-[#F4F0E6] outline-none transition placeholder:text-[#5F625A] focus:border-[#E7B84B]/40 focus:ring-2 focus:ring-[#E7B84B]/10"
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-xs text-[#9A9D94]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!newEmail.trim()) {
                    alert(
                      "Please enter an email address."
                    );
                    return;
                  }

                  const storedProfile =
                    window.localStorage.getItem(
                      PROFILE_KEY
                    );

                  const existingProfile =
                    storedProfile
                      ? JSON.parse(
                          storedProfile
                        )
                      : initialProfile;

                  const nextProfile = {
                    ...initialProfile,
                    ...existingProfile,
                    email: newEmail.trim(),
                  };

                  window.localStorage.setItem(
                    PROFILE_KEY,
                    JSON.stringify(
                      nextProfile
                    )
                  );

                  window.location.reload();
                }}
                className="rounded-xl bg-[#E7B84B] px-4 py-2.5 text-xs font-semibold text-[#151713]"
              >
                Save email
              </button>
            </div>
          </div>
        ) : null}

        {type === "password" ? (
          <div className="mt-6">
            <p className="text-sm leading-6 text-[#9A9D94]">
              Create a new password for your NexaFlow
              account.
            </p>

            <label className="mt-5 block text-xs font-medium text-[#C8CBC1]">
              New password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="Minimum 8 characters"
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#151713] px-4 py-3 text-sm text-[#F4F0E6] outline-none transition placeholder:text-[#5F625A] focus:border-[#E7B84B]/40 focus:ring-2 focus:ring-[#E7B84B]/10"
            />

            <label className="mt-4 block text-xs font-medium text-[#C8CBC1]">
              Confirm password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              placeholder="Repeat your password"
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#151713] px-4 py-3 text-sm text-[#F4F0E6] outline-none transition placeholder:text-[#5F625A] focus:border-[#E7B84B]/40 focus:ring-2 focus:ring-[#E7B84B]/10"
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-xs text-[#9A9D94]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onPasswordChange}
                className="rounded-xl bg-[#E7B84B] px-4 py-2.5 text-xs font-semibold text-[#151713]"
              >
                Change password
              </button>
            </div>
          </div>
        ) : null}

        {type === "sessions" ? (
          <div className="mt-6">
            <div className="rounded-2xl border border-[#5ED6A0]/20 bg-[#5ED6A0]/5 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5ED6A0]/10 text-[#5ED6A0]">
                  ●
                </span>

                <div>
                  <p className="text-sm font-medium">
                    Current browser session
                  </p>

                  <p className="mt-1 text-xs text-[#858980]">
                    Active now · This device
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-[#656960]">
              Session management is running in demo
              mode. Server-side session tracking can be
              connected when authentication is wired to
              the database.
            </p>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-[#E7B84B] px-4 py-2.5 text-xs font-semibold text-[#151713]"
              >
                Done
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}