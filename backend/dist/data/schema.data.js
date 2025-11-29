"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formSchema = void 0;
exports.formSchema = {
    name: "employee-onboarding",
    title: "Employee Onboarding",
    description: "Collect basic details for new employees.",
    fields: [
        {
            name: "fullName",
            label: "Full Name",
            type: "text",
            placeholder: "Enter your full name",
            required: true,
            validations: {
                minLength: 3,
                maxLength: 80,
            },
        },
        {
            name: "email",
            label: "Work Email",
            type: "text",
            inputType: "email",
            placeholder: "Enter your email",
            required: true,
            validations: {
                pattern: "^\\S+@\\S+\\.\\S+$",
                message: "Please enter a valid email address.",
            },
        },
        {
            name: "age",
            label: "Age",
            type: "number",
            placeholder: "Enter your age",
            required: true,
            validations: {
                min: 18,
                max: 65,
            },
        },
        {
            name: "department",
            label: "Department",
            type: "select",
            placeholder: "Select department",
            required: true,
            options: [
                { label: "Engineering", value: "engineering" },
                { label: "Product", value: "product" },
                { label: "Design", value: "design" },
                { label: "HR", value: "hr" },
                { label: "Legal", value: "legal" },
                { label: "Marketing", value: "marketing" },
                { label: "Sales", value: "sales" },
            ],
        },
        {
            name: "skills",
            label: "Primary Skills",
            type: "select",
            placeholder: "Select skills",
            required: true,
            options: [
                { label: "React.js", value: "react" },
                { label: "Node.js", value: "node" },
                { label: "Angular.js", value: "angular" },
                { label: "TypeScript", value: "ts" },
                { label: "JavaScript", value: "js" },
                { label: "HTML", value: "html" },
                { label: "CSS", value: "css" },
            ],
            validations: {
                minSelected: 1,
            },
        },
        {
            name: "joiningDate",
            label: "Joining Date",
            type: "date",
            placeholder: "Select a date",
            required: true,
        },
        {
            name: "remote",
            label: "Remote Eligible",
            type: "switch",
            required: false,
            defaultValue: false,
        },
        {
            name: "about",
            label: "About / Notes",
            type: "textarea",
            placeholder: "Anything we should know?",
            required: false,
            validations: {
                maxLength: 500,
            },
        },
    ],
};
