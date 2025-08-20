import Header from '../../components/Header'
import { Heading, Text } from '../../components'
import { InstagramIcon, TelegramIcon, TelIcon } from '../../assets/icons'

const Yordam = () => {
  return (
    <div className='containers'>
        <Header title='Yordam'/>
        <div className='mt-[30px] space-y-[10px]'>
            <Heading tag='h2'>Biz doim siz bilan aloqadamiz</Heading>
            <Text classList='!text-black/70'>Har qanday savollarga javob beramiz, buyurtma bilan yordam beramiz, istaklarni tinglaymiz</Text>
            <div className='flex gap-[30px] mt-[30px]'>
                <div>
                    <InstagramIcon/>
                    <Text classList='!text-[13px]'>Instagram</Text>
                </div>
                <div>
                    <TelegramIcon/>
                    <Text classList='!text-[13px]'>Telegram</Text>
                </div>
                <div>
                    <TelIcon/>
                    <Text classList='!text-[13px]'>Aloqa uchun</Text>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Yordam