import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();
const departmentData = [
  ['Computer Science', 'CSE', 'Building the systems and ideas that shape tomorrow.'],
  ['Electronics & Communication', 'ECE', 'Connecting people, devices and possibilities.'],
  ['Mechanical Engineering', 'ME', 'Designing a more capable, sustainable world.'],
  ['Civil Engineering', 'CE', 'Creating resilient places for people to thrive.'],
  ['Management Studies', 'MBA', 'Turning thoughtful leadership into real impact.'],
  ['Design & Innovation', 'D&I', 'Making useful things, beautifully.'],
] as const;
const roleNames = ['SUPER_ADMIN', 'DEPARTMENT_HEAD', 'FACULTY', 'STUDENT_COORDINATOR', 'RESOURCE_MANAGER'];
const demoUsers: Array<[string, string, string]> = [
  ['admin@unisync.edu', 'Aarav Mehta', 'SUPER_ADMIN'], ['maya.iyer@unisync.edu', 'Maya Iyer', 'DEPARTMENT_HEAD'],
  ['arjun.rao@unisync.edu', 'Arjun Rao', 'DEPARTMENT_HEAD'], ['srinivas@unisync.edu', 'K Srinivas', 'DEPARTMENT_HEAD'],
  ['leena.das@unisync.edu', 'Leena Das', 'DEPARTMENT_HEAD'], ['nisha.menon@unisync.edu', 'Nisha Menon', 'DEPARTMENT_HEAD'],
  ['dev.shah@unisync.edu', 'Dev Shah', 'DEPARTMENT_HEAD'], ['ananya@unisync.edu', 'Ananya Sharma', 'FACULTY'],
  ['rahul@unisync.edu', 'Rahul Nair', 'FACULTY'], ['vikram@unisync.edu', 'Vikram Patel', 'FACULTY'],
  ['priya@unisync.edu', 'Priya Das', 'FACULTY'], ['meera@unisync.edu', 'Meera Krishnan', 'FACULTY'],
  ['rohan@unisync.edu', 'Rohan Kapoor', 'FACULTY'], ['isha@unisync.edu', 'Isha Thomas', 'FACULTY'],
  ['karthik@unisync.edu', 'Karthik Rao', 'FACULTY'], ['sana@unisync.edu', 'Sana Ali', 'FACULTY'],
  ['naveen@unisync.edu', 'Naveen Bhat', 'FACULTY'], ['tara@unisync.edu', 'Tara Sen', 'FACULTY'],
  ['coord1@unisync.edu', 'Aditi Rao', 'STUDENT_COORDINATOR'], ['coord2@unisync.edu', 'Kabir Shah', 'STUDENT_COORDINATOR'],
  ['coord3@unisync.edu', 'Sara Paul', 'STUDENT_COORDINATOR'], ['coord4@unisync.edu', 'Neil George', 'STUDENT_COORDINATOR'],
  ['lab.cse@unisync.edu', 'Riya Verma', 'RESOURCE_MANAGER'], ['lab.ece@unisync.edu', 'Irfan Khan', 'RESOURCE_MANAGER'],
  ['lab.me@unisync.edu', 'Pooja Nair', 'RESOURCE_MANAGER'],
];
const categoryNames = ['Lab', 'Classroom', 'Seminar Hall', 'Equipment', 'Software License', 'Vehicle', 'Faculty Expertise'];
const projectNames = ['Campus Energy Intelligence', 'Accessible Campus Map', 'Autonomous Delivery Rover', 'Circular Materials Lab', 'Student Wellbeing Index', 'Smart Irrigation Pilot', 'Community Innovation Clinic', 'Open Source Assistive Tech'];
const eventNames = ['Interdepartmental Research Forum', 'Design for Good Open Studio', 'Sustainable Campus Hackathon', 'Faculty Research Mixer', 'Robotics Open Lab', 'Innovation Showcase', 'Civic Design Roundtable', 'Entrepreneurship Week', 'Climate Futures Workshop', 'Project Demo Day'];

async function main(): Promise<void> {
  await db.$transaction([
    db.notification.deleteMany(), db.approvalStep.deleteMany(), db.booking.deleteMany(), db.task.deleteMany(),
    db.milestone.deleteMany(), db.projectMember.deleteMany(), db.project.deleteMany(), db.eventRegistration.deleteMany(),
    db.event.deleteMany(), db.attachment.deleteMany(), db.resource.deleteMany(), db.resourceCategory.deleteMany(),
    db.user.deleteMany(), db.announcement.deleteMany(), db.department.deleteMany(), db.role.deleteMany(), db.setting.deleteMany(),
  ]);
  const roles = new Map<string, string>();
  for (const name of roleNames) {
    const role = await db.role.create({ data: { name } });
    roles.set(name, role.id);
  }
  const departments: Array<{ id: string }> = [];
  for (const [name, shortCode, description] of departmentData) {
    departments.push(await db.department.create({ data: { name, shortCode, description } }));
  }
  const passwordHash = await bcrypt.hash('Password@123', 10);
  const users: Array<{ id: string }> = [];
  for (let index = 0; index < demoUsers.length; index += 1) {
    const [email, name, roleName] = demoUsers[index];
    users.push(await db.user.create({ data: {
      email, name, passwordHash, roleId: roles.get(roleName)!,
      departmentId: index === 0 ? undefined : departments[(index - 1) % departments.length].id,
      designation: roleName.toLowerCase().replaceAll('_', ' '),
      skills: JSON.stringify(['collaboration', 'research']), phone: `+91 98${String(index).padStart(8, '0')}`,
    } }));
  }
  for (let index = 0; index < departments.length; index += 1) {
    await db.department.update({ where: { id: departments[index].id }, data: { headId: users[index + 1].id } });
  }
  const categories = new Map<string, string>();
  for (const name of categoryNames) categories.set(name, (await db.resourceCategory.create({ data: { name } })).id);
  const resources: Array<{ id: string }> = [];
  const resourceNames = ['Innovation Lab', 'Seminar Hall', 'Robotics Studio', 'Design Thinking Room', 'Portable Projector Kit', 'Materials Testing Lab', 'Executive Classroom', 'Electronics Prototyping Lab', 'Campus Van', 'Research Lab', 'Computer Lab', 'Conference Room', '3D Printer', 'Survey Drone', 'CAD Workstations', 'Acoustics Lab', 'Smart Classroom', 'Fabrication Studio', 'Lecture Hall', 'Video Camera Kit', 'Microcontroller Kit', 'Laser Cutter', 'Hydraulics Lab', 'Greenhouse', 'Board Room', 'Podcast Studio', 'VR Headset Set', 'Data Science Lab', 'Auditorium', 'EV Test Bench', 'Concrete Mixer', 'GIS Workstation', 'Digital License Pool', 'Faculty Speaker Pool', 'Electric Shuttle', 'Product Studio', 'Biochemistry Lab', 'Network Lab', 'Rapid Prototyping Kit', 'Seminar Hall 3', 'Microfabrication Lab', 'Materials Library'];
  for (let index = 0; index < resourceNames.length; index += 1) {
    const category = categoryNames[index % categoryNames.length];
    resources.push(await db.resource.create({ data: {
      name: resourceNames[index], categoryId: categories.get(category)!, departmentId: departments[index % 6].id,
      location: `${['Block A', 'Block B', 'Main Building', 'Workshop', 'Library', 'Business Block'][index % 6]} · ${101 + index}`,
      capacity: [24, 32, 18, 120, 1, 16, 42][index % 7], description: `Shared ${category.toLowerCase()} for teaching and research.`,
      status: index % 11 === 0 ? 'MAINTENANCE' : index % 7 === 0 ? 'IN_USE' : 'AVAILABLE',
      sharingPolicy: index % 8 === 0 ? 'OPEN' : index % 13 === 0 ? 'PRIVATE' : 'APPROVAL_NEEDED',
      specifications: JSON.stringify({ hours: '08:00–20:00', equipment: 'Standard campus configuration' }),
    } }));
  }
  const now = new Date('2026-10-21T08:00:00Z');
  const projects: Array<{ id: string }> = [];
  for (let index = 0; index < projectNames.length; index += 1) {
    projects.push(await db.project.create({ data: {
      title: projectNames[index], description: 'A collaborative campus project bringing practical research and interdisciplinary teams together.',
      ownerId: users[7 + index % 10].id, departmentId: departments[index % 6].id,
      startAt: new Date(now.getTime() + index * 86400000), endAt: new Date(now.getTime() + (45 + index * 4) * 86400000),
      budget: 25000 + index * 5000, status: index === 0 ? 'ACTIVE' : 'PLANNING', priority: index % 3 === 0 ? 'HIGH' : 'NORMAL',
      collaboratingDepartments: JSON.stringify([departments[(index + 1) % 6].id, departments[(index + 2) % 6].id]),
      members: { create: [{ userId: users[7 + index % 10].id, role: 'OWNER' }, { userId: users[8 + index % 10].id }, { userId: users[9 + index % 10].id }] },
      milestones: { create: [{ title: 'Discovery and research', dueAt: new Date(now.getTime() + 10 * 86400000) }, { title: 'Prototype review', dueAt: new Date(now.getTime() + 30 * 86400000) }] },
      tasks: { create: Array.from({ length: 4 }, (_, taskIndex) => ({
        title: ['Scope the pilot', 'Interview users', 'Build a first prototype', 'Share progress'][taskIndex],
        description: 'Coordinate with the project team and capture outcomes.', status: ['DONE', 'IN_PROGRESS', 'TODO', 'TODO'][taskIndex],
        assigneeId: users[7 + (index + taskIndex) % 10].id, dueAt: new Date(now.getTime() + (taskIndex + 3) * 86400000), order: taskIndex,
      })) },
    } }));
  }
  for (let index = 0; index < eventNames.length; index += 1) {
    const startAt = new Date(now.getTime() + (index + 2) * 86400000);
    await db.event.create({ data: { title: eventNames[index], description: 'An open campus event for learning and collaboration.', departmentId: departments[index % 6].id, location: ['Seminar Hall 2', 'Innovation Lab', 'Auditorium'][index % 3], startAt, endAt: new Date(startAt.getTime() + 2 * 3600000), capacity: 40 + index * 12 } });
    await db.announcement.create({ data: { title: ['October resource sharing update', 'Research forum registration is open', 'Campus hours this semester'][index % 3], body: 'Find opportunities to collaborate and share resources with the wider campus.', authorId: users[0].id, departmentId: index % 2 ? departments[index % 6].id : undefined } });
  }
  const statuses = ['APPROVED', 'APPROVED', 'PENDING', 'COMPLETED', 'REJECTED'];
  for (let index = 0; index < 64; index += 1) {
    const status = statuses[index % statuses.length];
    const startAt = new Date(now.getTime() + (index % 28 - 5) * 86400000 + ((index * 3) % 10) * 3600000);
    const booking = await db.booking.create({ data: {
      resourceId: resources[index % resources.length].id, requesterId: users[7 + index % 10].id,
      title: ['Research workshop', 'Project planning session', 'Equipment test', 'Campus collaboration meeting'][index % 4],
      purpose: 'Shared teaching, student project work and research collaboration.', startAt,
      endAt: new Date(startAt.getTime() + (1 + index % 3) * 3600000), attendees: 8 + index % 30, status,
    } });
    if (status === 'PENDING' || status === 'APPROVED') {
      await db.approvalStep.create({ data: { bookingId: booking.id, approverId: users[1 + index % 6].id, stepOrder: 1, status: status === 'APPROVED' ? 'APPROVED' : 'PENDING', actedAt: status === 'APPROVED' ? new Date() : undefined } });
    }
  }
  for (const user of users.slice(0, 12)) await db.notification.create({ data: { userId: user.id, title: 'Welcome to UniSync', body: 'Your campus workspace is ready. Explore shared resources and projects.', type: 'WELCOME' } });
  const settings: Record<string, unknown> = { workingHours: '08:00–20:00', maximumBookingHours: 8, advanceBookingDays: 90, pendingExpiryHours: 72 };
  for (const [key, value] of Object.entries(settings)) await db.setting.create({ data: { key, value: JSON.stringify(value) } });
  console.log(`Seeded ${departments.length} departments, ${users.length} users, ${resources.length} resources, 64 bookings, ${projects.length} projects and 10 events.`);
}

main().catch((error: unknown) => { console.error(error); process.exitCode = 1; }).finally(() => db.$disconnect());
