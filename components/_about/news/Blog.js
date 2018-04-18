import BlogPost from './BlogPost'

const Blog = () => {
  const posts = [0, 0, 0, 0, 0]
  const renderBlog = posts.map((post, i) =>
    <BlogPost key={i} />
  )
  return (
    <div className='outer-container'>
      <div className='inner-container'>{ renderBlog }</div>
      <style jsx>{`
        .outer-container {
          padding: 2vw;
        }
        .inner-container {
          display: flex;
          flex-direction: column;
          justify-content: space-between;

        }
      `}</style>
    </div>
  )
}

export default Blog
