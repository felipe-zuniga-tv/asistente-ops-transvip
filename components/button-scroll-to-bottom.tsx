import { cn } from '@/lib/utils'
import { Button, type ButtonProps } from '@/components/ui/button'
import { ArrowDown } from 'lucide-react'

interface ButtonScrollToBottomProps extends ButtonProps {
  isAtBottom: boolean
  scrollToBottom: () => void
}

export function ButtonScrollToBottom({
  className,
  isAtBottom,
  scrollToBottom,
  ...props
}: ButtonScrollToBottomProps) {
  // console.log(`isAtBottom: ${isAtBottom}`);
  
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        'button-scroll-to-bottom',
        'absolute right-4 top-[80%] bg-slate-200 transition-opacity duration-300 z-20',
        isAtBottom ? 'opacity-0' : 'opacity-100',
        className as string
      )}
      onClick={() => scrollToBottom()}
      {...props}
    >
      <ArrowDown className='size-4' />
      <span className="sr-only">Scroll to bottom</span>
    </Button>
  )
}