"use client";

import { useState } from "react";
import { useSession } from "@/components/session-provider";
import { Button, Card, Field, Input, Textarea, useToast } from "@/components/ui";
import { initials, roleBadgeClasses } from "@/lib/utils";

export default function ProfilePage() {
  const user = useSession();
  const { push } = useToast();
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [gradeLevel, setGradeLevel] = useState(user.gradeLevel ?? "");
  const [subject, setSubject] = useState(user.subject ?? "");
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPw, setChangingPw] = useState(false);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, bio, gradeLevel, subject }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      push("Profile updated", "success");
    } catch (err) {
      push(err instanceof Error ? err.message : "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setChangingPw(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      push("Password updated", "success");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      push(err instanceof Error ? err.message : "Failed to update password", "error");
    } finally {
      setChangingPw(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-sm text-slate-500">Manage your personal information and account security.</p>
      </div>

      <Card className="flex items-center gap-4">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white"
          style={{ backgroundColor: user.avatarColor }}
        >
          {initials(user.name)}
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-900">{user.name}</p>
          <p className="text-sm text-slate-500">{user.email}</p>
          <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${roleBadgeClasses(user.role)}`}>
            {user.role}
          </span>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 text-sm font-semibold text-slate-700">Personal Information</h3>
        <form onSubmit={saveProfile} className="space-y-4">
          <Field label="Full name">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Phone number">
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" />
          </Field>
          {user.role === "student" && (
            <Field label="Grade level">
              <Input value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} />
            </Field>
          )}
          {user.role === "teacher" && (
            <Field label="Primary subject">
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
            </Field>
          )}
          <Field label="Bio">
            <Textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A short bio about yourself…" />
          </Field>
          <div className="flex justify-end">
            <Button type="submit" loading={saving}>
              Save changes
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <h3 className="mb-4 text-sm font-semibold text-slate-700">Change Password</h3>
        <form onSubmit={changePassword} className="space-y-4">
          <Field label="Current password">
            <Input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </Field>
          <Field label="New password">
            <Input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Field>
          <div className="flex justify-end">
            <Button type="submit" loading={changingPw} variant="secondary">
              Update password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
