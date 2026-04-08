import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();

  const tagBody = await prisma.tag.create({ data: { name: "Custom Body", slug: "custom-body" } });
  const tagLampu = await prisma.tag.create({ data: { name: "Lampu", slug: "lampu" } });
  const tagRem = await prisma.tag.create({ data: { name: "Rem", slug: "rem" } });
  const tagKnalpot = await prisma.tag.create({ data: { name: "Knalpot", slug: "knalpot" } });

  await prisma.post.create({
    data: {
      title: "Full Build NMAX Turbo: Carbon + LED + Brembo",
      slug: "full-build-nmax-turbo-carbon-led-brembo",
      summary: "Modifikasi komprehensif NMAX Turbo dari ujung depan hingga belakang.",
      content: "NMAX Turbo ini telah dimodifikasi secara ekstensif menggunakan parts premium. Untuk bodi, kami menyematkan full carbon kevlar yang membuatnya tampak jauh lebih agresif. Lampu utama sudah projector dual-lens LED, dan pengereman mempercayakan Brembo P4 didepan dengan master rem RCS corsa corta. Knalpot menggunakan exhaust full system untuk performa maksimal.",
      imageUrl: "/nmax_turbo_body.png",
      modifiedParts: {
        create: [
          { name: "Body full carbon kevlar", status: "PnP", description: "Melapisi seluruh panel halus dan kasar NMAX memakai lembaran carbon kevlar asli ber-pattern forged. Membantu estetika layaknya motor balap." },
          { name: "Projector dual-lens LED", status: "Custom", description: "Bobok headlamp mika asli untuk memasukkan dua lensa projector LED buatan AES, memberikan cutoff pencahayaan presisi maksimal pada malam hari." },
          { name: "Brembo P4 Front Caliper", status: "Butuh Bracket", description: "Sistem rem depan diganti sepenuhnya dengan caliper 4-piston. Harus membuat CNC bracket khusus tiang as bawah shock NMAX agar fitmentnya center." },
          { name: "Master rem RCS Corsa Corta", status: "PnP", description: "Handle rem kanan kini disematkan Brembo Corsa Corta yang punya mode penyetelan rem halus dan responsif ala MotoGP." },
          { name: "Knalpot Exhaust Full System", status: "PnP", description: "Pipa buang yang diracik khusus sejak header leher knalpot hingga muffler slip-on belakang untuk extra boost tenaga Turbo (YECVT)." }
        ]
      },
      tags: {
        connect: [{ id: tagBody.id }, { id: tagLampu.id }, { id: tagRem.id }, { id: tagKnalpot.id }],
      },
      comments: {
        create: [
          { authorName: "Budi Setiawan", content: "Keren parah bang! Part carbonnya abis berapa tuh?" },
          { authorName: "Andi", content: "Master rem brembonya ori atau replika gan?" }
        ]
      }
    },
  });

  await prisma.post.create({
    data: {
      title: "Upgrade Pengereman NMAX Turbo dengan Brembo M4",
      slug: "upgrade-pengereman-nmax-turbo-brembo-m4",
      summary: "Panduan dan review modifikasi rem NMAX Turbo agar lebih pakem.",
      content: "Banyak pengguna NMAX merasa rem standar cukup, tapi bagi yang suka kecepatan, upgrade ke Brembo M4 adalah sebuah keharusan. Post ini akan membahas step by step penggantian caliper, pembuatan bracket cnc, hingga ganti selang rem hel.",
      imageUrl: "/nmax_turbo_brakes.png",
      modifiedParts: {
        create: [
          { name: "Caliper Brembo M4", status: "Butuh Bracket", description: "Kaliper monoblock besar khas superbike 1000cc namun dipasang pada motor matic untuk cengkraman pengereman ekstrim." },
          { name: "Bracket CNC Custom", status: "Custom", description: "Bracket custom berbahan duralium T6 yang dipotong mesin CNC agar penempatan Brembo M4 di shock standar presisi sempurna." },
          { name: "Selang Rem Hel", status: "PnP", description: "Selang rem berbahan kawat baja anyam asli dari brand HEL (Inggris). Anti mengembang saat pengereman panas." }
        ]
      },
      tags: {
        connect: [{ id: tagRem.id }],
      },
    },
  });

  await prisma.post.create({
    data: {
      title: "Inspirasi Lampu Alis & Projie NMAX Turbo RGB",
      slug: "inspirasi-lampu-alis-projie-nmax-turbo-rgb",
      summary: "Modif lampu biar NMAX makin garang di malam hari.",
      content: "Lampu standar projie memang sudah LED, namun kurang terang saat menembus hujan atau kabut gelap. Di modif kali ini kita menambahkan dual biled AES turbo se experience ditambahkan lazy eyes RGB yang bisa diatur lewat HP via bluetooth.",
      imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      modifiedParts: {
        create: [
          { name: "Lampu utama dual biled AES Turbo SE", status: "Custom", description: "Mengganti core lampu utama asli yamaha menggunakan projie biled SE yang tahan dalam hujan lebat." },
          { name: "Lazy eyes RGB custom", status: "Custom", description: "Alis DRL bawaan dibongkar dan diganti mika putih lazy eyes dipenuhi modul warna warni lampu RGB LED." },
          { name: "Modul pengatur bluetooth", status: "PnP", description: "Controller plug&play khusus V-Ixion / NMAX untuk mengganti warna alis lazy text via smartphone app." }
        ]
      },
      tags: {
        connect: [{ id: tagLampu.id }],
      },
    },
  });

  console.log("Database seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
