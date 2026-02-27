import { totalScore as totalScoreClass } from "../../styles";

type TotalScoreSectionProps = {
	totalScore: number;
};

export function TotalScoreSection({ totalScore }: TotalScoreSectionProps) {
	return <div className={totalScoreClass}>Total Score: {totalScore}</div>;
}
