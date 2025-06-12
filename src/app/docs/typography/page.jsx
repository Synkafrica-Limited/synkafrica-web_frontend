import Heading from '@/components/ui/Heading'
import DisplayText from '@/components/ui/DisplayText'
import Text from '@/components/ui/Text'
import Caption from '@/components/ui/Caption'
import UppercaseText from '@/components/ui/UppercaseText'

export default function TypographyDemo() {
  const sample = "The quick brown fox jumps over the lazy dog."

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <Heading level={1}>Display / Hero Text</Heading>
      <DisplayText>{sample}</DisplayText>

      <Heading level={1}>Heading 1 (h1)</Heading>
      <Heading level={1}>{sample}</Heading>

      <Heading level={2}>Heading 2 (h2)</Heading>
      <Heading level={2}>{sample}</Heading>

      <Heading level={3}>Heading 3 (h3)</Heading>
      <Heading level={3}>{sample}</Heading>

      <Heading level={4}>Heading 4 (h4)</Heading>
      <Heading level={4}>{sample}</Heading>

      <Heading level={5}>Heading 5 (h5)</Heading>
      <Heading level={5}>{sample}</Heading>

      <Heading level={6}>Heading 6 (h6)</Heading>
      <Heading level={6}>{sample}</Heading>

      <Heading level={2}>Body Text</Heading>
      <Text>{sample}</Text>

      <Heading level={2}>Caption Text</Heading>
      <Caption>{sample}</Caption>

      <Heading level={2}>Uppercase Label</Heading>
      <UppercaseText>{sample}</UppercaseText>
    </div>
  )
}
