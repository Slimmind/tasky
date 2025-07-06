import { PropsWithChildren } from 'react';
import Button from '../button';
import { useRouter } from '@tanstack/react-router';

type BackButtonProps = {
	mod?: string;
} & PropsWithChildren;

export const BackButton = ({ mod, children }: BackButtonProps) => {
	const router = useRouter();
	return (
		<Button mod={mod || 'wide cancel'} onClick={() => router.history.back()}>
			{children}
		</Button>
	);
};
