import dynamic from 'next/dynamic';
const BlogPage = dynamic(() => import('./BlogClient'), { ssr: false });
export default BlogPage;
