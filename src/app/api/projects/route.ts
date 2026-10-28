import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(PROJECTS_FILE)) {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function readProjects(): any[] {
  try {
    ensureDataFile();
    const raw = fs.readFileSync(PROJECTS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading projects.json:', err);
    return [];
  }
}

function writeProjects(projects: any[]) {
  ensureDataFile();
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf-8');
}

// GET /api/projects - Ambil semua project tersimpan dari database server
export async function GET() {
  const projects = readProjects();
  return NextResponse.json({ success: true, projects });
}

// POST /api/projects - Simpan project baru / perbarui ke database server
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.id) {
      return NextResponse.json({ success: false, error: 'Project data or ID is missing' }, { status: 400 });
    }

    const projects = readProjects();
    const existingIdx = projects.findIndex((p: any) => p.id === body.id);

    if (existingIdx >= 0) {
      projects[existingIdx] = body;
    } else {
      projects.unshift(body);
    }

    // Batasi 100 project terakhir di database server
    writeProjects(projects.slice(0, 100));

    return NextResponse.json({ success: true, project: body });
  } catch (err: any) {
    console.error('Error saving project to server database:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE /api/projects - Hapus project dari database server berdasarkan ID
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Project ID is required' }, { status: 400 });
    }

    const projects = readProjects();
    const filtered = projects.filter((p: any) => p.id !== id);
    writeProjects(filtered);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting project from server database:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
