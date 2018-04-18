const ApplyNowBtn = () => {
  return (
    <div className='outer-container'>
      <div className='inner-container'>APPLY HERE</div>
      <style jsx>{`
        .outer-container {
          width: 200px;
          margin: 1em;
        }
        .inner-container {
          font-size: 1.5em;
          font-weight: bold;
          border: 1px solid black;
          border-radius: 5px;
          background: lightgrey;
          padding: .5em;
          text-align: center;
        }
      `}</style>
    </div>
  )
}

export default ApplyNowBtn
