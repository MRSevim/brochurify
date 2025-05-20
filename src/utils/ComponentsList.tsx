import Button from "@/components/BuilderComponents/Button";
import { PropsWithId } from "./Types";
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
  button: (props: PropsWithId) => <Button {...props} />,
  column: (props: PropsWithId) => <Column {...props} />,
  text: (props: PropsWithId) => <Text {...props} />,
  row: (props: PropsWithId) => <Row {...props} />,
  image: (props: PropsWithId) => <Image {...props} />,
  audio: (props: PropsWithId) => <Audio {...props} />,
  video: (props: PropsWithId) => <Video {...props} />,
  container: (props: PropsWithId) => <Container {...props} />,
  divider: (props: PropsWithId) => <Divider {...props} />,
  icon: (props: PropsWithId) => <Icon {...props} />,
  fixed: (props: PropsWithId) => <Fixed {...props} />,
};
