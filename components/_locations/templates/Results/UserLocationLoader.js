const UserLocationLoader = () => (
  <div className='outer-wrapper'>
    <div className='inner-wrapper'> attempting to geolocate you! </div>
    <div>(this can take a second...)</div>
    <style jsx>{`
      .outer-wrapper, .inner-wrapper {
        width: 100%;
        height: 100%;
      }
      .inner-wrapper{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    `}</style>
  </div>
)

export default UserLocationLoader
