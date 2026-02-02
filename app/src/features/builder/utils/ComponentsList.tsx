import Button from "../components/BuilderComponents/Elements/Button";
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
import {
  AudioPropsForRendering,
  ButtonPropsForRendering,
  ColumnPropsForRendering,
  ContainerPropsForRendering,
  DividerPropsForRendering,
  FixedPropsForRendering,
  IconPropsForRendering,
  ImagePropsForRendering,
  LayoutTypes,
  RowPropsForRendering,
  TextPropsForRendering,
  VideoPropsForRendering,
} from "./types/propTypes.d";

export const componentList: Record<LayoutTypes, any> = {
  button: (props: ButtonPropsForRendering) => <Button {...props} />,
  column: (props: ColumnPropsForRendering) => <Column {...props} />,
  text: (props: TextPropsForRendering) => <Text {...props} />,
  row: (props: RowPropsForRendering) => <Row {...props} />,
  image: (props: ImagePropsForRendering) => <Image {...props} />,
  audio: (props: AudioPropsForRendering) => <Audio {...props} />,
  video: (props: VideoPropsForRendering) => <Video {...props} />,
  container: (props: ContainerPropsForRendering) => <Container {...props} />,
  divider: (props: DividerPropsForRendering) => <Divider {...props} />,
  icon: (props: IconPropsForRendering) => <Icon {...props} />,
  fixed: (props: FixedPropsForRendering) => <Fixed {...props} />,
};
