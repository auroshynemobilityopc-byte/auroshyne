import { Drawer } from "../../../components/shared/Drawer";
import { Button } from "../../../components/shared/Button";
import { useActiveTechnicians } from "../../technicians/hooks";

interface Props {
    open: boolean;
    onClose: () => void;
    onAssign: (techId: string) => void;
}

export const AssignTechnicianSheet: React.FC<Props> = ({
    open,
    onClose,
    onAssign,
}) => {
    const { data: techs = [] } = useActiveTechnicians();


    return (
        <Drawer open={open} onClose={onClose}>
            <h2 className="text-lg mb-4">Assign Technician</h2>

            <div className="flex flex-col gap-2">
                {techs.map((t) => (
                    <Button
                        key={t._id}
                        variant="secondary"
                        onClick={() => onAssign(t._id)}
                    >
                        {t.name} • {t.mobile}
                    </Button>
                ))}

            </div>
        </Drawer>
    );
};
