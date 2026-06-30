import { useModal } from "@/providers";
import { ConnectForm, type ConnectOptions } from "./ConnectForm";
import { ReportForm } from "./ReportForm";
import { FeedbackForm } from "./FeedbackForm";

/**
 * Imperative openers for the shared enquiry/report/feedback overlays.
 * Built on the global ModalProvider — call from any component:
 *   const { openConnect } = useOverlays();
 *   <Button onClick={() => openConnect({ intent: "product", sellerName, itemName })}>Connect</Button>
 */
export function useOverlays() {
  const { open, close } = useModal();

  const openConnect = (opts: ConnectOptions = {}) =>
    open(<ConnectForm {...opts} onDone={close} />, { title: "Send an enquiry" });

  const openReport = () => open(<ReportForm onDone={close} />, { title: "Report this listing" });

  const openFeedback = () => open(<FeedbackForm onDone={close} />, { title: "Share feedback" });

  return { openConnect, openReport, openFeedback };
}
