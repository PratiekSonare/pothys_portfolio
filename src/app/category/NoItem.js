import React from 'react'

const NoItem = () => {
  return (
    <div className='text3 flex flex-col justify-center items-center'>
        <img
            src='https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/sad-svgrepo-com.svg'
            alt=''
            style={{width: '30%'}}
        >
        </img>
        <span className='text-4xl mb-2'>No items found</span>
        <span className='text-xl text0 text-gray-600'>of your desired category / filter...</span>
    </div>
  )
}

export default NoItem