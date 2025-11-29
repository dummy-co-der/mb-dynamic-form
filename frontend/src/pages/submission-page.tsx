import React from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useSubmissions } from "../api/submissions";
import type { Submission } from "../api/types";

interface SubmissionsResponse {
    data: Submission[];
    page: number;
    totalPages: number;
    total: number;
}

const columns: ColumnDef<Submission>[] = [
    {
        header: "ID",
        accessorKey: "id",
    },
    {
        header: "Full Name",
        cell: ({ row }) => {
            const data = row.original.data as Record<string, unknown>;
            return <span>{(data.fullName as string) ?? "-"}</span>;
        },
    },
    {
        header: "Department",
        cell: ({ row }) => {
            const data = row.original.data as Record<string, unknown>;
            return <span>{(data.department as string) ?? "-"}</span>;
        },
    },
    {
        header: "Created At",
        accessorKey: "createdAt",
        cell: ({ getValue }) => {
            const value = getValue<string>();
            return (
                <span className="whitespace-nowrap text-xs">
                    {new Date(value).toLocaleString()}
                </span>
            );
        },
    },
];

export const SubmissionsPage: React.FC = () => {
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(5);
    const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
        "desc"
    );

    const query = useSubmissions(page, limit, sortDirection);
    const data = query.data as SubmissionsResponse | undefined;
    const submissions = data?.data ?? [];

    const table = useReactTable({
        data: submissions,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div
            className="
            space-y-5 rounded-xl p-5 sm:p-7
            bg-white
            shadow-xl ring-1 
            ring-slate-200
            transition
        "
        >
            {/* Header */}
            <div
                className="
                flex flex-col sm:flex-row items-start sm:items-center 
                justify-between gap-4
            "
            >
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Submissions</h2>
                    <p className="text-sm text-slate-600">
                        Server-side pagination & sorting by created date.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 text-xs">
                    <label className="flex items-center gap-1">
                        <span className="text-slate-700">Sort:</span>
                        <select
                            value={sortDirection}
                            onChange={(e) => {
                                setPage(1);
                                setSortDirection(e.target.value as "asc" | "desc");
                            }}
                            className="
                                rounded border border-slate-300
                                bg-white
                                text-slate-800
                                px-2.5 py-1.5 shadow-sm
                            "
                        >
                            <option value="desc">Newest first</option>
                            <option value="asc">Oldest first</option>
                        </select>
                    </label>

                    <label className="flex items-center gap-1">
                        <span className="text-slate-700">Per Page:</span>
                        <select
                            value={limit}
                            onChange={(e) => {
                                setPage(1);
                                setLimit(Number(e.target.value));
                            }}
                            className="
                                rounded border border-slate-300 
                                bg-white 
                                text-slate-800 
                                px-2.5 py-1.5 shadow-sm
                            "
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                    </label>
                </div>
            </div>

            {/* Content State */}
            {query.isLoading ? (
                <p className="text-sm text-slate-600">Loading submissions...</p>
            ) : query.isError ? (
                <p className="text-sm text-red-600">
                    Failed to load submissions. Please try again later.
                </p>
            ) : submissions.length === 0 ? (
                <p className="text-sm text-slate-600">No submissions yet.</p>
            ) : (
                <>
                    <div>
                        <table className="min-w-full divide-y divide-slate-200 text-sm">
                            <thead className="bg-slate-50">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                className="
                                                    px-3 py-2 text-left 
                                                    text-xs font-semibold uppercase tracking-wide 
                                                    text-slate-600
                                                "
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>

                            <tbody className="divide-y divide-slate-200 bg-white">
                                {table.getRowModel().rows.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="
                                            hover:bg-slate-50
                                            transition
                                        "
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td
                                                key={cell.id}
                                                className="
                                                    px-3 py-2 align-top text-xs 
                                                    text-slate-700 
                                                "
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div
                        className="
                        flex flex-col sm:flex-row items-start sm:items-center 
                        justify-between gap-3 pt-3 text-xs 
                        text-slate-700
                    "
                    >
                        <div>
                            Page {data?.page} of {data?.totalPages} • Total {data?.total}
                        </div>

                        <div className="flex gap-2">
                            <button
                                className="
                                    rounded border border-slate-300 
                                    bg-white
                                    px-3 py-1 
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                "
                                disabled={page <= 1 || query.isFetching}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                            >
                                Previous
                            </button>

                            <button
                                className="
                                    rounded border border-slate-300
                                    bg-white
                                    px-3 py-1 
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                "
                                disabled={!data || page >= data.totalPages || query.isFetching}
                                onClick={() =>
                                    setPage((p) => (!data ? p : Math.min(data.totalPages, p + 1)))
                                }
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )
            }
        </div >
    );
};
