"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "@/components/session-provider";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  Modal,
  Select,
  Skeleton,
  useToast,
} from "@/components/ui";
import { initials, roleBadgeClasses } from "@/lib/utils";

type ManagedUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "student" | "parent";
  status: string;
  gradeLevel: string | null;
  subject: string | null;
  phone: string | null;
  avatarColor: string;
  createdAt: string;
};

const emptyForm = {
  name: "",
  email: "",
  password: "",
  role: "student" as ManagedUser["role"],
  gradeLevel: "",
  subject: "",
};

export default function UsersPage() {
  const user = useSession();
  const { push } = useToast();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data.users ?? []);
    } catch {
      push("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesSearch =
        !search.trim() ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [users, search, roleFilter]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers((prev) => [...prev, data.user]);
      push("User created", "success");
      setModalOpen(false);
      setForm(emptyForm);
    } catch (err) {
      push(err instanceof Error ? err.message : "Failed to create user", "error");
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(u: ManagedUser) {
    setBusyId(u.id);
    const newStatus = u.status === "active" ? "suspended" : "active";
    const prev = users;
    setUsers((p) => p.map((x) => (x.id === u.id ? { ...x, status: newStatus } : x)));
    try {
      const res = await fetch(`/api/users/${u.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      push(`User ${newStatus === "active" ? "reactivated" : "suspended"}`, "success");
    } catch {
      setUsers(prev);
      push("Failed to update user", "error");
    } finally {
      setBusyId(null);
    }
  }

  async function onDelete(u: ManagedUser) {
    if (u.id === user.id) return push("You cannot delete your own account", "error");
    if (!confirm(`Delete ${u.name}? This cannot be undone.`)) return;
    const prev = users;
    setUsers((p) => p.filter((x) => x.id !== u.id));
    try {
      const res = await fetch(`/api/users/${u.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      push("User deleted", "success");
    } catch {
      setUsers(prev);
      push("Failed to delete user", "error");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Administration</h1>
          <p className="text-sm text-slate-500">Manage all users, roles, and account status across EduMentor AI.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>+ New User</Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input placeholder="Search by name or email…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="w-40">
          <option value="all">All roles</option>
          <option value="admin">Admins</option>
          <option value="teacher">Faculty</option>
          <option value="student">Students</option>
          <option value="parent">Parents</option>
        </Select>
      </div>

      {loading ? (
        <Skeleton className="h-96 w-full" />
      ) : filtered.length === 0 ? (
        <EmptyState icon="👥" title="No users found" />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase text-slate-400">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Detail</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: u.avatarColor }}
                      >
                        {initials(u.name)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{u.name}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={roleBadgeClasses(u.role)}>{u.role}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {u.role === "student" && (u.gradeLevel ?? "—")}
                    {u.role === "teacher" && (u.subject ?? "—")}
                    {(u.role === "admin" || u.role === "parent") && "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={u.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}>
                      {u.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" loading={busyId === u.id} onClick={() => toggleStatus(u)}>
                        {u.status === "active" ? "Suspend" : "Activate"}
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => onDelete(u)} disabled={u.id === user.id}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create User">
        <form onSubmit={onCreate} className="space-y-4">
          <Field label="Full name">
            <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Email">
            <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Temporary password">
            <Input
              type="text"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </Field>
          <Field label="Role">
            <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as ManagedUser["role"] })}>
              <option value="student">Student</option>
              <option value="teacher">Faculty</option>
              <option value="parent">Parent</option>
              <option value="admin">Administrator</option>
            </Select>
          </Field>
          {form.role === "student" && (
            <Field label="Grade level">
              <Input value={form.gradeLevel} onChange={(e) => setForm({ ...form, gradeLevel: e.target.value })} />
            </Field>
          )}
          {form.role === "teacher" && (
            <Field label="Subject">
              <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </Field>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Create user
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
