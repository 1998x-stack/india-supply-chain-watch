import Link from "next/link";
export default function NotFound(){return <div className="container-page py-28 text-center"><div className="text-5xl font-black text-brand">404</div><h1 className="mt-4 text-2xl font-bold text-navy">没有找到这个页面</h1><p className="mt-3 text-sm text-[#798992]">链接可能已经发生变化，请返回首页查找。</p><Link href="/" className="primary-btn mt-7">返回首页</Link></div>}
