import { Mail, Phone } from "lucide-react"
import Image from "next/image"
import { Agent } from "@/lib/data"
import { Button } from "@/components/ui/button"

interface PropertyAgentProps {
  agent: Agent
}

export function PropertyAgent({ agent }: PropertyAgentProps) {
  return (
    <div className='bg-muted/30 rounded-2xl p-6 border space-y-6'>
      <div className='flex items-center gap-4'>
        <div className='relative w-16 h-16 rounded-full overflow-hidden border-2 border-background'>
          <Image
            src={agent.image}
            alt={agent.name}
            fill
            className='object-cover'
          />
        </div>
        <div>
          <h3 className='font-semibold text-lg'>{agent.name}</h3>
          <p className='text-sm text-muted-foreground'>Real Estate Agent</p>
        </div>
      </div>

      <div className='space-y-3'>
        <Button className='w-full gap-2' size='lg'>
          <Phone className='w-4 h-4' />
          {agent.phone}
        </Button>
        <Button variant='outline' className='w-full gap-2' size='lg'>
          <Mail className='w-4 h-4' />
          Email Agent
        </Button>
      </div>

      <div className='text-xs text-center text-muted-foreground pt-2'>
        By contacting, you agree to our Terms of Service and Privacy Policy.
      </div>
    </div>
  )
}
