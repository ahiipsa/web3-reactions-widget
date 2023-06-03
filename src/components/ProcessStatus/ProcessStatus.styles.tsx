import styled from 'styled-components'
import { palette } from '../../constants'
import {LoaderStatus} from "../../stores/LoadersStore";

export const LoaderContainer = styled.div<{ colorType?: any }>`
  display: flex;
  margin: 0 auto;
  width: 100%;
  word-break: break-all;
  white-space: pre-line;
  max-width: 550px;
  flex-direction: column;
  align-items: center;
  gap: 0.2em;
  font-size: 0.9rem;
  font-size: ${(props) =>
    props.colorType !== LoaderStatus.PROGRESS && '.95rem !important'};
  color: ${(props) =>
    props.colorType === LoaderStatus.ERROR
      ? palette.PinkRed
      : props.colorType === LoaderStatus.SUCCESS
      ? palette.KellyGreen
      : palette.default};
`
