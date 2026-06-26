/**
 * JSX intrinsic augmentation for custom hast elements rendered by
 * react-markdown@10. The rehype-image-placeholder plugin emits
 * `<image-placeholder data-prompt="…">` which React renders as an unknown
 * HTML element. Under TS strict mode we need to declare the intrinsic so
 * components-map keying and prop types stay sound.
 */
import "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "image-placeholder": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { "data-prompt"?: string },
        HTMLElement
      >;
    }
  }
}
