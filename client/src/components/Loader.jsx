import React from 'react'

const Loader = () => {
    return (
        <div className="min-h-[75vh] p-20 flex items-center justify-center flex-col">
            <img className='h-30' src='https://www.icegif.com/wp-content/uploads/2023/07/icegif-1262.gif'/>
            <h1 className="text-center  font-bold text-2xl text-gray-300">Loading...</h1>
        </div>
    )
}

export default Loader
