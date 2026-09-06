import fs from "fs";
import path from "path";
import {
  projects as initialProjects,
  finishingPackages as initialPackages,
  beforeAfterCases as initialBeforeAfter,
  type Project,
  type FinishingPackage,
  type BeforeAfterShowcase,
} from "@/lib/content";

export type LeadStatus =
  | "new"
  | "contacted"
  | "survey_scheduled"
  | "contract_signed"
  | "lost";

export interface Lead {
  id: string;
  referenceId: string;
  name: string;
  phone: string;
  type: string;
  stage: string;
  area: string;
  city: string;
  details: string;
  status: LeadStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentStore {
  projects: Project[];
  packages: FinishingPackage[];
  beforeAfter: BeforeAfterShowcase[];
}

const DB_DIR = path.join(process.cwd(), "data", "db");
const LEADS_FILE = path.join(DB_DIR, "leads.json");
const CONTENT_FILE = path.join(DB_DIR, "content.json");
const PROJECTS_TRACKING_FILE = path.join(DB_DIR, "projects_tracking.json");

// Ensure directory exists
function ensureDir() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

// Atomic file writer with Windows locking resilience
async function writeJsonAtomic(filePath: string, data: unknown) {
  ensureDir();
  const tempPath = `${filePath}.${Date.now()}_${Math.random().toString(36).substring(2, 8)}.tmp`;
  const content = JSON.stringify(data, null, 2);
  await fs.promises.writeFile(tempPath, content, "utf8");

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await fs.promises.rename(tempPath, filePath);
      return;
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (attempt < 4 && (code === "EPERM" || code === "EBUSY")) {
        await new Promise((resolve) => setTimeout(resolve, 20 * (attempt + 1)));
      } else {
        try {
          await fs.promises.copyFile(tempPath, filePath);
          await fs.promises.unlink(tempPath).catch(() => {});
          return;
        } catch {
          await fs.promises.writeFile(filePath, content, "utf8");
          await fs.promises.unlink(tempPath).catch(() => {});
          return;
        }
      }
    }
  }
}

// Read JSON safely
function readJsonSync<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// ─── Leads Repository ────────────────────────────────────────────────────────
export async function getLeads(): Promise<Lead[]> {
  ensureDir();
  return readJsonSync<Lead[]>(LEADS_FILE, []);
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const leads = await getLeads();
  return leads.find((l) => l.id === id || l.referenceId === id) || null;
}

export async function createLead(
  input: Omit<Lead, "id" | "status" | "createdAt" | "updatedAt"> & {
    status?: LeadStatus;
    notes?: string;
  }
): Promise<Lead> {
  const leads = await getLeads();
  const now = new Date().toISOString();
  const id = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const newLead: Lead = {
    ...input,
    id,
    status: input.status || "new",
    notes: input.notes || "",
    createdAt: now,
    updatedAt: now,
  };

  leads.unshift(newLead);
  await writeJsonAtomic(LEADS_FILE, leads);
  return newLead;
}

export async function updateLead(
  id: string,
  updates: Partial<Omit<Lead, "id" | "createdAt">>
): Promise<Lead | null> {
  const leads = await getLeads();
  const index = leads.findIndex((l) => l.id === id || l.referenceId === id);
  if (index === -1) return null;

  const updated: Lead = {
    ...leads[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  leads[index] = updated;
  await writeJsonAtomic(LEADS_FILE, leads);
  return updated;
}

export async function deleteLead(id: string): Promise<boolean> {
  const leads = await getLeads();
  const filtered = leads.filter((l) => l.id !== id && l.referenceId !== id);
  if (filtered.length === leads.length) return false;

  await writeJsonAtomic(LEADS_FILE, filtered);
  return true;
}

// ─── Content Repository ──────────────────────────────────────────────────────
function getInitialContent(): ContentStore {
  return {
    projects: initialProjects,
    packages: initialPackages,
    beforeAfter: initialBeforeAfter,
  };
}

export async function getContent(): Promise<ContentStore> {
  ensureDir();
  if (!fs.existsSync(CONTENT_FILE)) {
    const initial = getInitialContent();
    await writeJsonAtomic(CONTENT_FILE, initial);
    return initial;
  }
  return readJsonSync<ContentStore>(CONTENT_FILE, getInitialContent());
}

export async function getDbPackages(): Promise<FinishingPackage[]> {
  const content = await getContent();
  return content.packages;
}

export async function updateDbPackage(
  id: FinishingPackage["id"],
  updates: Partial<FinishingPackage>
): Promise<FinishingPackage | null> {
  const content = await getContent();
  const index = content.packages.findIndex((p) => p.id === id);
  if (index === -1) return null;

  content.packages[index] = { ...content.packages[index], ...updates };
  await writeJsonAtomic(CONTENT_FILE, content);
  return content.packages[index];
}

export async function getDbProjects(): Promise<Project[]> {
  const content = await getContent();
  return content.projects;
}

export async function updateDbProject(
  index: number,
  updates: Partial<Project>
): Promise<Project | null> {
  const content = await getContent();
  if (index < 0 || index >= content.projects.length) return null;

  content.projects[index] = { ...content.projects[index], ...updates };
  await writeJsonAtomic(CONTENT_FILE, content);
  return content.projects[index];
}

export async function addDbProject(project: Project): Promise<Project> {
  const content = await getContent();
  content.projects.unshift(project);
  await writeJsonAtomic(CONTENT_FILE, content);
  return project;
}

export async function getDbBeforeAfter(): Promise<BeforeAfterShowcase[]> {
  const content = await getContent();
  return content.beforeAfter;
}

export async function addDbBeforeAfter(showcase: BeforeAfterShowcase): Promise<BeforeAfterShowcase> {
  const content = await getContent();
  content.beforeAfter.unshift(showcase);
  await writeJsonAtomic(CONTENT_FILE, content);
  return showcase;
}

// ─── Client Project Tracking Store ────────────────────────────────────────────
export type ProjectStageKey =
  | "concept_design"
  | "mep_rough_in"
  | "civil_plaster"
  | "woodwork_finishes"
  | "snagging_handover";

export interface ProjectMilestone {
  id: ProjectStageKey;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  progress: number; // 0 to 100
  status: "completed" | "in_progress" | "pending";
  targetDate?: string;
  completedAt?: string;
}

export interface SiteUpdate {
  id: string;
  date: string;
  title: { ar: string; en: string };
  notes: { ar: string; en: string };
  imageUrl?: string;
  phase: ProjectStageKey;
  engineerName: string;
}

export interface ClientNotification {
  id: string;
  timestamp: string;
  channel: "whatsapp" | "sms" | "webhook";
  recipientPhone: string;
  recipientName: string;
  eventType: "milestone_progress" | "site_update";
  title: string;
  status: "dispatched" | "logged";
}

export interface ClientProject {
  id: string;
  referenceId: string;
  clientName: string;
  clientPhone: string;
  unitType: string;
  area: string;
  compound: { ar: string; en: string };
  city: { ar: string; en: string };
  contractDate: string;
  targetHandoverDate: string;
  overallProgress: number;
  currentStage: ProjectStageKey;
  siteEngineer: {
    name: string;
    title: { ar: string; en: string };
    phone: string;
  };
  milestones: ProjectMilestone[];
  siteUpdates: SiteUpdate[];
  notificationsSent?: ClientNotification[];
  createdAt: string;
  updatedAt: string;
}


export function createDefaultMilestones(): ProjectMilestone[] {
  return [
    {
      id: "concept_design",
      title: { ar: "التصميم المعماري ورسومات الـ 3D", en: "Architectural & 3D Design" },
      description: {
        ar: "مخططات التوزيع المعماري والرسومات التنفيذية والمود بورد",
        en: "Layout planning, architectural shop drawings & 3D visualizations",
      },
      progress: 100,
      status: "completed",
      completedAt: "2026-01-20",
    },
    {
      id: "mep_rough_in",
      title: { ar: "تأسيس الكهروميكانيك (MEP)", en: "MEP Rough-Ins (HVAC, Plumbing, Elec)" },
      description: {
        ar: "تأسيس مواسير الكهرباء، الصرف الذكي، دكتات التكييف وشبكة الإنذار",
        en: "Electrical conduits, concealed plumbing lines & HVAC ductwork",
      },
      progress: 100,
      status: "completed",
      completedAt: "2026-02-15",
    },
    {
      id: "civil_plaster",
      title: { ar: "أعمال البناء والمحارة والعزل", en: "Masonry, Plaster & Waterproofing" },
      description: {
        ar: "تعديل القواطع الداخلية، البياض المسلح، وعزل الحمامات والتراس بالفوم الإسمنتي",
        en: "Internal partitions, fiber-reinforced plaster & wet area waterproofing",
      },
      progress: 75,
      status: "in_progress",
      targetDate: "2026-03-25",
    },
    {
      id: "woodwork_finishes",
      title: { ar: "التشطيبات، الرخام، والأخشاب", en: "Finishes, Marble & Custom Woodwork" },
      description: {
        ar: "أرضيات الرخام الإسباني، تجاليد الأخشاب الطبيعية، والأسقف المعلقة",
        en: "Imported marble flooring, custom woodwork & architectural ceilings",
      },
      progress: 30,
      status: "pending",
      targetDate: "2026-04-30",
    },
    {
      id: "snagging_handover",
      title: { ar: "المعاينة النهائية والتسليم الفندقي", en: "Final Snagging & Turnkey Handover" },
      description: {
        ar: "اختبارات الأحمال، الفحص الهندسي الدقيق، والتسليم بمحضر رسمي",
        en: "Engineering load tests, white-glove cleaning & turnkey handover",
      },
      progress: 0,
      status: "pending",
      targetDate: "2026-05-25",
    },
  ];
}

function getInitialClientProjects(): ClientProject[] {
  return [
    {
      id: "proj_sample_1",
      referenceId: "ION-7824",
      clientName: "Eng. Tarek Mansour",
      clientPhone: "+201002345678",
      unitType: "Stand-Alone Luxury Villa",
      area: "380 m²",
      compound: { ar: "ماونتن فيو آي سيتي", en: "Mountain View iCity" },
      city: { ar: "القاهرة الجديدة", en: "New Cairo" },
      contractDate: "2026-01-05",
      targetHandoverDate: "2026-05-25",
      overallProgress: 68,
      currentStage: "civil_plaster",
      siteEngineer: {
        name: "Eng. Ahmed El-Sherif",
        title: { ar: "مهندس الموقع التنفيذي الأول", en: "Senior Lead Site Engineer" },
        phone: "+201026040854",
      },
      milestones: createDefaultMilestones(),
      siteUpdates: [
        {
          id: "upd_1",
          date: "2026-03-02",
          title: {
            ar: "استكمال العزل المائي واختبار الضغط للحمامات الرئيسية",
            en: "Master suite waterproofing & 48hr pressure testing completed",
          },
          notes: {
            ar: "تم بنجاح اختبار شبكة المياه والتأكد من عدم وجود أي تسريبات، مع اعتماد طبقات العزل الإسمنتي المزدوج.",
            en: "Plumbing lines pressure tested at 10 bar without drop. Cementitious membrane passed inspection.",
          },
          imageUrl:
            "https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=1200&q=80",
          phase: "civil_plaster",
          engineerName: "Eng. Ahmed El-Sherif",
        },
        {
          id: "upd_2",
          date: "2026-02-14",
          title: {
            ar: "انتهاء دكتات التكييف المركزي وتأسيس سمارت هوم KNX",
            en: "Concealed AC ducting and KNX automation rough-ins signed off",
          },
          notes: {
            ar: "تم سحب كابلات التحكم وشبكة التوزيع الرقمية لجميع غرف المعيشة والأجنحة.",
            en: "Low-voltage automation cables pulled to master distribution board. Acoustic duct insulation applied.",
          },
          imageUrl:
            "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
          phase: "mep_rough_in",
          engineerName: "Eng. Ahmed El-Sherif",
        },
      ],
      createdAt: "2026-01-05T10:00:00.000Z",
      updatedAt: "2026-03-02T16:00:00.000Z",
    },
    {
      id: "proj_sample_2",
      referenceId: "ION-9102",
      clientName: "Dr. Laila Nour",
      clientPhone: "+201119876543",
      unitType: "Penthouse Residence",
      area: "240 m²",
      compound: { ar: "بالم هيلز", en: "Palm Hills" },
      city: { ar: "الشيخ زايد", en: "Sheikh Zayed" },
      contractDate: "2025-11-10",
      targetHandoverDate: "2026-03-15",
      overallProgress: 95,
      currentStage: "snagging_handover",
      siteEngineer: {
        name: "Eng. Karim Samir",
        title: { ar: "مهندس الإشراف والتشطيبات الفندقية", en: "Finishing & Snagging Lead" },
        phone: "+201026040854",
      },
      milestones: [
        {
          id: "concept_design",
          title: { ar: "التصميم المعماري ورسومات الـ 3D", en: "Architectural & 3D Design" },
          description: { ar: "مخططات التوزيع المعماري", en: "Layout planning" },
          progress: 100,
          status: "completed",
          completedAt: "2025-11-25",
        },
        {
          id: "mep_rough_in",
          title: { ar: "تأسيس الكهروميكانيك (MEP)", en: "MEP Rough-Ins" },
          description: { ar: "تأسيس مواسير الكهرباء والصرف", en: "Electrical & plumbing" },
          progress: 100,
          status: "completed",
          completedAt: "2025-12-30",
        },
        {
          id: "civil_plaster",
          title: { ar: "أعمال البناء والمحارة والعزل", en: "Masonry, Plaster & Waterproofing" },
          description: { ar: "البياض والعزل", en: "Plaster & waterproofing" },
          progress: 100,
          status: "completed",
          completedAt: "2026-01-20",
        },
        {
          id: "woodwork_finishes",
          title: { ar: "التشطيبات، الرخام، والأخشاب", en: "Finishes, Marble & Woodwork" },
          description: { ar: "الأرضيات والتجاليد والتجهيزات", en: "Flooring, joinery & finishes" },
          progress: 100,
          status: "completed",
          completedAt: "2026-02-28",
        },
        {
          id: "snagging_handover",
          title: { ar: "المعاينة النهائية والتسليم الفندقي", en: "Final Snagging & Turnkey Handover" },
          description: { ar: "الفحص الدقيق والتسليم", en: "Final inspection & handover" },
          progress: 75,
          status: "in_progress",
          targetDate: "2026-03-15",
        },
      ],
      siteUpdates: [
        {
          id: "upd_3",
          date: "2026-02-28",
          title: {
            ar: "استكمال جلي وتلميع رخام الكرارة وتركيب الإضاءات الخطية",
            en: "Carrara marble diamond polishing & linear LED accents installed",
          },
          notes: {
            ar: "تم تنظيف وتجهيز الوحدة للفحص النهائي مع العميل.",
            en: "Protective floor film removed. Ready for client inspection walk-through.",
          },
          imageUrl:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
          phase: "woodwork_finishes",
          engineerName: "Eng. Karim Samir",
        },
      ],
      createdAt: "2025-11-10T10:00:00.000Z",
      updatedAt: "2026-02-28T16:00:00.000Z",
    },
  ];
}

export async function getClientProjects(): Promise<ClientProject[]> {
  ensureDir();
  if (!fs.existsSync(PROJECTS_TRACKING_FILE)) {
    const initial = getInitialClientProjects();
    await writeJsonAtomic(PROJECTS_TRACKING_FILE, initial);
    return initial;
  }
  return readJsonSync<ClientProject[]>(PROJECTS_TRACKING_FILE, getInitialClientProjects());
}

export async function getClientProjectByRef(ref: string): Promise<ClientProject | null> {
  const projects = await getClientProjects();
  const clean = ref.trim().toLowerCase();
  const hasLetters = /[a-z]/i.test(ref);

  return (
    projects.find((p) => {
      const pId = p.id.toLowerCase();
      const pRef = p.referenceId.toLowerCase();
      if (pId === clean || pRef === clean) return true;

      if (!hasLetters) {
        const cleanPhone = clean.replace(/[^0-9]/g, "");
        const pPhone = p.clientPhone.replace(/[^0-9]/g, "");
        if (cleanPhone.length >= 8 && pPhone.endsWith(cleanPhone)) {
          return true;
        }
      }
      return false;
    }) || null
  );
}



export async function createClientProject(
  input: Omit<ClientProject, "id" | "createdAt" | "updatedAt">
): Promise<ClientProject> {
  const projects = await getClientProjects();
  const now = new Date().toISOString();
  const id = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const newProj: ClientProject = {
    ...input,
    id,
    createdAt: now,
    updatedAt: now,
  };

  projects.unshift(newProj);
  await writeJsonAtomic(PROJECTS_TRACKING_FILE, projects);
  return newProj;
}

export async function updateClientProject(
  id: string,
  updates: Partial<Omit<ClientProject, "id" | "createdAt">>
): Promise<ClientProject | null> {
  const projects = await getClientProjects();
  const index = projects.findIndex((p) => p.id === id || p.referenceId === id);
  if (index === -1) return null;

  const updated: ClientProject = {
    ...projects[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  projects[index] = updated;
  await writeJsonAtomic(PROJECTS_TRACKING_FILE, projects);
  return updated;
}

export async function addSiteUpdate(
  projectId: string,
  update: Omit<SiteUpdate, "id">
): Promise<SiteUpdate | null> {
  const projects = await getClientProjects();
  const index = projects.findIndex((p) => p.id === projectId || p.referenceId === projectId);
  if (index === -1) return null;

  const newUpdate: SiteUpdate = {
    ...update,
    id: `upd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
  };

  projects[index].siteUpdates.unshift(newUpdate);
  projects[index].updatedAt = new Date().toISOString();

  await writeJsonAtomic(PROJECTS_TRACKING_FILE, projects);
  return newUpdate;
}

export async function addClientProjectNotification(
  projectId: string,
  notif: Omit<ClientNotification, "id" | "timestamp">
): Promise<ClientNotification | null> {
  const projects = await getClientProjects();
  const index = projects.findIndex((p) => p.id === projectId || p.referenceId === projectId);
  if (index === -1) return null;

  const newNotif: ClientNotification = {
    ...notif,
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
  };

  if (!projects[index].notificationsSent) {
    projects[index].notificationsSent = [];
  }
  projects[index].notificationsSent.unshift(newNotif);
  await writeJsonAtomic(PROJECTS_TRACKING_FILE, projects);
  return newNotif;
}


export async function convertLeadToProject(leadId: string): Promise<ClientProject | null> {
  const lead = await getLeadById(leadId);
  if (!lead) return null;

  // Check if project already exists for this referenceId
  const existing = await getClientProjectByRef(lead.referenceId);
  if (existing) return existing;

  const milestones = createDefaultMilestones();
  const newProjectInput: Omit<ClientProject, "id" | "createdAt" | "updatedAt"> = {
    referenceId: lead.referenceId,
    clientName: lead.name,
    clientPhone: lead.phone,
    unitType: lead.type ? lead.type.charAt(0).toUpperCase() + lead.type.slice(1) : "Residence",
    area: lead.area || "180 m²",
    compound: { ar: lead.city || "مشروع خاص", en: lead.city || "Private Compound" },
    city: { ar: lead.city || "القاهرة", en: lead.city || "Cairo" },
    contractDate: new Date().toISOString().split("T")[0],
    targetHandoverDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    overallProgress: 15,
    currentStage: "concept_design",
    siteEngineer: {
      name: "Eng. Ahmed El-Sherif",
      title: { ar: "مهندس الموقع التنفيذي", en: "Lead Site Engineer" },
      phone: "+201026040854",
    },
    milestones,
    siteUpdates: [],
  };

  return createClientProject(newProjectInput);
}

