import Loader from 'react-loaders'

const CustomLoader = () => {
  return (
    <div className='wrapper'>
      <Loader className='loader' type='line-spin-fade-loader' active />
      <style jsx>{`
        .wrapper {
          width:100%;
          height:100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .loader {
          width:10vw;
          height:10vw;
        }
      `}</style>
    </div>
  )
}

export default CustomLoader
