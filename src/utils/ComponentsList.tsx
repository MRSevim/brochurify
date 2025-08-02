import Button from "@/components/BuilderComponents/Button";
import { Props } from "./Types";
import Column from "@/components/BuilderComponents/Column";
import Text from "@/components/BuilderComponents/Text";
import Row from "@/components/BuilderComponents/Row";
import Image from "@/components/BuilderComponents/Image";
import Audio from "@/components/BuilderComponents/Audio";
import Video from "@/components/BuilderComponents/Video";
import Container from "@/components/BuilderComponents/Container";
import Divider from "@/components/BuilderComponents/Divider";
import Icon from "@/components/BuilderComponents/Icon";
import Fixed from "@/components/BuilderComponents/Fixed";

export const componentList = {
  button: (props: Props) => <Button {...props} />,
  column: (props: Props) => <Column {...props} />,
  text: (props: Props) => <Text {...props} />,
  row: (props: Props) => <Row {...props} />,
  image: (props: Props) => <Image {...props} />,
  audio: (props: Props) => <Audio {...props} />,
  video: (props: Props) => <Video {...props} />,
  container: (props: Props) => <Container {...props} />,
  divider: (props: Props) => <Divider {...props} />,
  icon: (props: Props) => <Icon {...props} />,
  fixed: (props: Props) => <Fixed {...props} />,
};
