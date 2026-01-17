import Button from "../components/BuilderComponents/Elements/Button";
import { PropsWithId } from "../../../utils/types/Types";
import Column from "../components/BuilderComponents/Elements/Column";
import Text from "../components/BuilderComponents/Elements/Text";
import Row from "../components/BuilderComponents/Elements/Row";
import Image from "../components/BuilderComponents/Elements/Image";
import Audio from "../components/BuilderComponents/Elements/Audio";
import Video from "../components/BuilderComponents/Elements/Video";
import Container from "../components/BuilderComponents/Elements/Container";
import Divider from "../components/BuilderComponents/Elements/Divider";
import Icon from "../components/BuilderComponents/Elements/Icon";
import Fixed from "../components/BuilderComponents/Elements/Fixed";

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
