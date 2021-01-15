import React from 'react';

import {DataTableComponent} from './datatableComponent'

export const ContentTab = ({ add, specKey }) => {
    return (
        <>
            <DataTableComponent add={add} specKey={specKey} />
        </>
    )
};