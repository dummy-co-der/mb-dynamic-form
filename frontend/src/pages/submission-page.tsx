import React from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useSubmissions, useDeleteSubmission } from "../api/submissions";
import { useFormSchema } from "../api/form";
import type { Submission } from "../api/types";
import { ViewModal } from "../components/view-modal";

interface SubmissionsResponse {
    data: Submission[];
    page: number;
    totalPages: number;
    total: number;
}

interface ActionsMenuProps {
    submission: Submission;
    onView: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

interface SubmissionsPageProps {
    onNavigateToForm?: () => void;
}

const ActionsMenu: React.FC<ActionsMenuProps> = ({
    submission,
    onView,
    onEdit,
    onDelete,
}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const close = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, [isOpen]);

    const openMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

        document.documentElement.style.setProperty(
            "--menu-top",
            `${rect.bottom}px`
        );
        document.documentElement.style.setProperty(
            "--menu-left",
            `${rect.right - 160}px`
        );

        setIsOpen(!isOpen);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={openMenu}
                className="p-1 sm:p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded cursor-pointer"
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 mt-1 w-40 sm:w-44 bg-white rounded-lg shadow-lg border border-slate-200 z-20 flex flex-col
        "
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onView();
                            setIsOpen(false);
                        }}
                        className="
                block w-full text-left 
                px-4 py-2 
                text-sm text-slate-700 
                hover:bg-slate-50 
                transition-colors cursor-pointer
            "
                    >
                        View
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                            setIsOpen(false);
                        }}
                        className="
                block w-full text-left 
                px-4 py-2 
                text-sm text-slate-700 
                hover:bg-slate-50 
                transition-colors cursor-pointer
            "
                    >
                        Edit
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                            setIsOpen(false);
                        }}
                        className="
                block w-full text-left 
                px-4 py-2 
                text-sm text-red-600 
                hover:bg-red-50 
                transition-colors cursor-pointers
            "
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export const SubmissionsPage: React.FC<SubmissionsPageProps> = ({
    onNavigateToForm,
}) => {
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(5);
    const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
        "desc"
    );
    const [viewingSubmission, setViewingSubmission] =
        React.useState<Submission | null>(null);

    const query = useSubmissions(page, limit, sortDirection);
    const { data: schema } = useFormSchema();
    const deleteSubmission = useDeleteSubmission();
    const data = query.data as SubmissionsResponse | undefined;
    const submissions = data?.data ?? [];

    const handleDelete = React.useCallback(
        (id: string) => {
            if (window.confirm("Are you sure you want to delete this submission?")) {
                deleteSubmission.mutate(id);
            }
        },
        [deleteSubmission]
    );

    const handleEdit = React.useCallback(
        (submission: Submission) => {
            // Store submission data in sessionStorage to pre-fill form
            sessionStorage.setItem("editSubmission", JSON.stringify(submission));
            if (onNavigateToForm) {
                onNavigateToForm();
            }
        },
        [onNavigateToForm]
    );

    const columns: ColumnDef<Submission>[] = React.useMemo(
        () => [
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
            {
                header: "Actions",
                cell: ({ row }) => (
                    <ActionsMenu
                        submission={row.original}
                        onView={() => setViewingSubmission(row.original)}
                        onEdit={() => handleEdit(row.original)}
                        onDelete={() => handleDelete(row.original.id)}
                    />
                ),
            },
        ],
        [handleDelete, handleEdit]
    );

    const table = useReactTable({
        data: submissions,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div
            className="
            space-y-5 rounded-xl p-4 sm:p-6 lg:p-7
            bg-white shadow-xl ring-1 ring-slate-200
            transition w-full overflow-hidden
        "
        >
            {/* Header */}
            <div
                className="
                flex flex-col md:flex-row items-start md:items-center 
                justify-between gap-4 w-full
            "
            >
                <div className="w-full">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                        Submissions
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600">
                        Server-side pagination & sorting by created date.
                    </p>
                </div>

                {/* Filters */}
                <div
                    className="
                    flex flex-wrap items-center gap-3 
                    text-xs sm:text-sm 
                    w-full md:w-auto
                "
                >
                    {/* Sort */}
                    <label className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="text-slate-700 whitespace-nowrap">Sort:</span>
                        <select
                            value={sortDirection}
                            onChange={(e) => {
                                setPage(1);
                                setSortDirection(e.target.value as "asc" | "desc");
                            }}
                            className="
                            rounded border border-slate-300
                            bg-white text-slate-800
                            px-2.5 py-1.5 shadow-sm w-full sm:w-auto
                        "
                        >
                            <option value="desc">Newest first</option>
                            <option value="asc">Oldest first</option>
                        </select>
                    </label>

                    {/* Per Page */}
                    <label className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="text-slate-700 whitespace-nowrap">Per Page:</span>
                        <select
                            value={limit}
                            onChange={(e) => {
                                setPage(1);
                                setLimit(Number(e.target.value));
                            }}
                            className="
                            rounded border border-slate-300
                            bg-white text-slate-800
                            px-2.5 py-1.5 shadow-sm w-full sm:w-auto
                        "
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                    </label>
                </div>
            </div>

            {/* Loading / Error / Empty */}
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
                    {/* Responsive table wrapper */}
                    <div className="w-full overflow-x-auto rounded-lg border border-slate-200">
                        <table className="min-w-[650px] w-full divide-y divide-slate-200 text-sm">
                            <thead className="bg-slate-50">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                className="
                                                px-3 py-2 text-left 
                                                text-[10px] sm:text-xs font-semibold 
                                                uppercase tracking-wide text-slate-600
                                                whitespace-nowrap
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
                                    <tr key={row.id} className="hover:bg-slate-50 transition">
                                        {row.getVisibleCells().map((cell) => (
                                            <td
                                                key={cell.id}
                                                className="
                                                px-3 py-2 align-top 
                                                text-xs sm:text-sm 
                                                text-slate-700 whitespace-nowrap
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
                        flex flex-col sm:flex-row 
                        items-start sm:items-center 
                        justify-between gap-3 pt-3 
                        text-xs sm:text-sm text-slate-700
                    "
                    >
                        <div>
                            Page {data?.page} of {data?.totalPages} • Total {data?.total}
                        </div>

                        <div className="flex gap-2">
                            <button
                                className="
                                rounded border border-slate-300 bg-white
                                px-3 py-1 
                                disabled:opacity-50 disabled:cursor-not-allowed
                                text-xs sm:text-sm
                            "
                                disabled={page <= 1 || query.isFetching}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                            >
                                Previous
                            </button>

                            <button
                                className="
                                rounded border border-slate-300 bg-white
                                px-3 py-1 
                                disabled:opacity-50 disabled:cursor-not-allowed
                                text-xs sm:text-sm
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
            )}

            <ViewModal
                submission={viewingSubmission}
                schema={schema ?? null}
                isOpen={!!viewingSubmission}
                onClose={() => setViewingSubmission(null)}
            />
        </div>
    );
};
