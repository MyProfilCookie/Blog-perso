import nextDynamic from 'next/dynamic';
const BlogPage = nextDynamic(() => import('./BlogClient'), { ssr: false });
export default BlogPage;
