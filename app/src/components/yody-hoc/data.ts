export type Page = "home" | "list" | "read" | "intro";

export interface Lesson {
  i: string;
  t: string;
  d: string;
  active?: boolean;
}

export interface Module {
  n: string;
  c: string;
  title: string;
  desc: string;
  lessons: Lesson[];
}

export interface Course {
  n: string;
  c: string;
  cDeep: string;
  tint: string;
  tag: string;
  title: string;
  desc: string;
  chapters: string;
  lessons: string;
  hours: string;
  cta: string;
  page: Page;
}

export const modules: Module[] = [
  {
    n: "I",
    c: "#7c6cf5",
    title: "Nền tảng Harness",
    desc: "Harness là gì, vòng đời tác tử và ranh giới môi trường.",
    lessons: [
      { i: "1.1", t: "Harness là gì?", d: "8 phút", active: true },
      { i: "1.2", t: "Vòng đời tác tử", d: "12 phút" },
      { i: "1.3", t: "Môi trường & ranh giới", d: "10 phút" },
    ],
  },
  {
    n: "II",
    c: "#fcaf16",
    title: "Thiết kế Môi trường",
    desc: "Sandbox, công cụ, quyền hạn và ngân sách tài nguyên.",
    lessons: [
      { i: "2.1", t: "Sandbox & cô lập", d: "11 phút" },
      { i: "2.2", t: "Công cụ & quyền hạn", d: "9 phút" },
      { i: "2.3", t: "Tài nguyên & ngân sách", d: "7 phút" },
    ],
  },
  {
    n: "III",
    c: "#10b981",
    title: "Quản lý Trạng thái",
    desc: "Bộ nhớ, cửa sổ ngữ cảnh, checkpoint và khôi phục.",
    lessons: [
      { i: "3.1", t: "Bộ nhớ ngắn & dài hạn", d: "13 phút" },
      { i: "3.2", t: "Cửa sổ ngữ cảnh", d: "10 phút" },
      { i: "3.3", t: "Checkpoint & khôi phục", d: "8 phút" },
    ],
  },
  {
    n: "IV",
    c: "#f472b6",
    title: "Kiểm chứng & Đánh giá",
    desc: "Kiểm thử hành vi, oracle đo lường và phát hiện hồi quy.",
    lessons: [
      { i: "4.1", t: "Kiểm thử hành vi", d: "12 phút" },
      { i: "4.2", t: "Oracle & đo lường", d: "9 phút" },
      { i: "4.3", t: "Phát hiện hồi quy", d: "7 phút" },
    ],
  },
  {
    n: "V",
    c: "#2a2b86",
    title: "Vận hành Thực tế",
    desc: "Triển khai an toàn, giám sát, cảnh báo và tối ưu chi phí.",
    lessons: [
      { i: "5.1", t: "Triển khai an toàn", d: "10 phút" },
      { i: "5.2", t: "Giám sát & cảnh báo", d: "11 phút" },
      { i: "5.3", t: "Tối ưu chi phí", d: "6 phút" },
    ],
  },
];

export const courses: Course[] = [
  {
    n: "01",
    c: "var(--iris)",
    cDeep: "var(--iris-deep)",
    tint: "var(--iris-tint)",
    tag: "Tác tử AI",
    title: "Kỹ thuật Harness cho tác tử AI",
    desc: "Thiết kế môi trường, quản lý trạng thái và kiểm chứng — đọc theo chương như một cuốn sách kỹ thuật.",
    chapters: "5",
    lessons: "15",
    hours: "~2.5",
    cta: "Bắt đầu học",
    page: "list",
  },
  {
    n: "02",
    c: "var(--mint)",
    cDeep: "var(--mint-deep)",
    tint: "var(--mint-tint)",
    tag: "Dữ liệu & RAG",
    title: "Nền tảng RAG cho hệ thống nội bộ",
    desc: "Truy hồi tăng cường: chuẩn hóa dữ liệu, embedding, đánh chỉ mục và xếp hạng để trả lời chính xác trên kho tài liệu YODY.",
    chapters: "4",
    lessons: "12",
    hours: "~2",
    cta: "Xem mục lục",
    page: "list",
  },
];

export const stats = { courses: courses.length, lessons: "27", hours: "~4.5" };

export const author = {
  name: "Nguyễn Minh Khôi",
  role: "Kỹ sư AI · YODY Tech",
  initials: "MK",
  bio: "Phụ trách hạ tầng tác tử AI tại YODY, từng xây các harness vận hành cho công cụ nội bộ. Thích biến hệ thống phức tạp thành những bước nhỏ kiểm chứng được.",
};

export const outcomes = [
  "Thiết kế môi trường sandbox an toàn cho tác tử",
  "Quản lý trạng thái, bộ nhớ và cửa sổ ngữ cảnh",
  "Viết oracle kiểm chứng và phát hiện hồi quy",
  "Triển khai, giám sát và tối ưu chi phí khi vận hành",
];

export const prereqs = ["Lập trình Python cơ bản", "Hiểu khái niệm LLM / API", "Quen dùng dòng lệnh"];

export const faqs = [
  {
    q: "Khóa học có mất phí không?",
    a: "Hoàn toàn miễn phí và công khai. Bạn không cần đăng ký hay đăng nhập để đọc bất kỳ bài nào.",
  },
  {
    q: "Tôi cần biết trước những gì?",
    a: "Chỉ cần lập trình cơ bản (ưu tiên Python) và hiểu khái niệm API. Các khái niệm về tác tử AI sẽ được giải thích từ đầu.",
  },
  {
    q: "Có cần cài đặt gì không?",
    a: "Phần lý thuyết đọc trực tiếp trên web. Phần thực hành dùng mã nguồn mẫu chạy được trên máy cá nhân với Python 3.10+.",
  },
  {
    q: "Khóa học có chứng chỉ không?",
    a: "Đây là tài liệu đào tạo mở, tập trung vào kiến thức nên không cấp chứng chỉ. Mục tiêu là bạn áp dụng được vào công việc thực tế.",
  },
];

export const harnessYaml = `harness:
  name: agent-harness
  environment: { sandbox: true, timeout: 120s }
  tools: [ file.read, file.write, shell.exec ]
  state: { memory: ephemeral, checkpoint: every-step }
  verify: { oracle: tests/acceptance, on_fail: rollback }`;