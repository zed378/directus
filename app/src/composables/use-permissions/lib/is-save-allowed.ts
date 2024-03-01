import { ComputedRef, computed, unref } from 'vue';
import { IsNew } from '../types';

export const isSaveAllowed = (isNew: IsNew, createAllowed: ComputedRef<boolean>, updateAllowed: ComputedRef<boolean>) =>
	computed(() => {
		if (unref(isNew)) {
			return createAllowed.value;
		}

		return updateAllowed.value;
	});
