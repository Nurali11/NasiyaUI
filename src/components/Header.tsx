import Heading from './Heading'
import { ArrowLeft } from '../assets/icons'
import { useNavigate } from 'react-router-dom'

const Header = ({title}: {title: string}) => {
  const navigate = useNavigate()
  return (
    <div className='flex pt-[30px] sticky z-10 top-[1px] bg-white'>
        <div onClick={() => navigate(-1)} className='w-[40%] cursor-pointer'><ArrowLeft/></div>
        <Heading classList='!text-[18px] !font-semibold' tag='h2' children={title}/>
    </div>
  )
}

export default Header