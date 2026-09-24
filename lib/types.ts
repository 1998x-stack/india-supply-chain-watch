export type Article = {
  slug: string;
  kind: string;
  category: string;
  date: string; // 事件、批准或生效日期，与文章来源日期分别展示
  publishedAt: string;
  checkedAt: string;
  title: string;
  excerpt: string;
  takeaway: string;
  points: string[];
  sourceLabel: string;
  sourceUrl: string;
  sourceType: string;
  verification: string;
  tags: string[];
};
export type TrackedProject = {
  id: string;
  name: string;
  product: string;
  sector: string;
  approvedOn: string;
  state: string;
  stage: string;
  sourceUrl: string;
  sourceLabel: string;
  verifiedAt: string;
  note: string;
};
