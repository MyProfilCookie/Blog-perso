"use client";

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports pour les composants NextUI les plus utilisés
const Button = dynamic(() => import('@nextui-org/react').then(mod => ({ default: mod.Button })), {
  ssr: false,
  loading: () => <button className="px-4 py-2 bg-gray-200 rounded animate-pulse" />
});

const Card = dynamic(() => import('@nextui-org/react').then(mod => ({ default: mod.Card })), {
  ssr: false,
  loading: () => <div className="p-4 bg-gray-100 rounded-lg animate-pulse" />
});

const CardBody = dynamic(() => import('@nextui-org/react').then(mod => ({ default: mod.CardBody })), {
  ssr: false,
  loading: () => <div className="p-4 animate-pulse" />
});

const CardHeader = dynamic(() => import('@nextui-org/react').then(mod => ({ default: mod.CardHeader })), {
  ssr: false,
  loading: () => <div className="p-4 border-b animate-pulse" />
});

const Input = dynamic(() => import('@nextui-org/react').then(mod => ({ default: mod.Input })), {
  ssr: false,
  loading: () => <input className="w-full p-2 border rounded animate-pulse" />
});

const Modal = dynamic(() => import('@nextui-org/react').then(mod => ({ default: mod.Modal })), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" />
});

const ModalContent = dynamic(() => import('@nextui-org/react').then(mod => ({ default: mod.ModalContent })), {
  ssr: false,
  loading: () => <div className="bg-white rounded-lg p-6 animate-pulse" />
});

const ModalHeader = dynamic(() => import('@nextui-org/react').then(mod => ({ default: mod.ModalHeader })), {
  ssr: false,
  loading: () => <div className="border-b pb-4 mb-4 animate-pulse" />
});

const ModalBody = dynamic(() => import('@nextui-org/react').then(mod => ({ default: mod.ModalBody })), {
  ssr: false,
  loading: () => <div className="py-4 animate-pulse" />
});

const ModalFooter = dynamic(() => import('@nextui-org/react').then(mod => ({ default: mod.ModalFooter })), {
  ssr: false,
  loading: () => <div className="border-t pt-4 mt-4 animate-pulse" />
});

const Spinner = dynamic(() => import('@nextui-org/react').then(mod => ({ default: mod.Spinner })), {
  ssr: false,
  loading: () => <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
});

const Progress = dynamic(() => import('@nextui-org/react').then(mod => ({ default: mod.Progress })), {
  ssr: false,
  loading: () => <div className="w-full bg-gray-200 rounded-full h-2 animate-pulse" />
});

const Table = dynamic(() => import('@nextui-org/react').then(mod => ({ default: mod.Table })), {
  ssr: false,
  loading: () => <div className="w-full border rounded-lg animate-pulse h-32" />
});

const TableHeader = dynamic(() => import('@nextui-org/react').then(mod => ({ default: mod.TableHeader })), {
  ssr: false,
  loading: () => <div className="bg-gray-100 p-2 animate-pulse" />
});

const TableBody = dynamic(() => import('@nextui-org/react').then(mod => ({ default: mod.TableBody })), {
  ssr: false,
  loading: () => <div className="p-2 animate-pulse" />
});

const TableRow = dynamic(() => import('@nextui-org/react').then(mod => ({ default: mod.TableRow })), {
  ssr: false,
  loading: () => <div className="border-b p-2 animate-pulse" />
});

const TableCell = dynamic(() => import('@nextui-org/react').then(mod => ({ default: mod.TableCell })), {
  ssr: false,
  loading: () => <div className="p-2 animate-pulse" />
});

const TableColumn = dynamic(() => import('@nextui-org/react').then(mod => ({ default: mod.TableColumn })), {
  ssr: false,
  loading: () => <div className="p-2 font-semibold animate-pulse" />
});

const Navbar = dynamic(() => import('@nextui-org/react').then(mod => ({ default: mod.Navbar })), {
  ssr: false,
  loading: () => <nav className="w-full bg-white shadow-sm p-4 animate-pulse" />
});

const NavbarBrand = dynamic(() => import('@nextui-org/react').then(mod => ({ default: mod.NavbarBrand })), {
  ssr: false,
  loading: () => <div className="flex items-center animate-pulse" />
});

const NavbarContent = dynamic(() => import('@nextui-org/react').then(mod => ({ default: mod.NavbarContent })), {
  ssr: false,
  loading: () => <div className="flex items-center gap-4 animate-pulse" />
});

const NavbarItem = dynamic(() => import('@nextui-org/react').then(mod => ({ default: mod.NavbarItem })), {
  ssr: false,
  loading: () => <div className="animate-pulse" />
});

const NavbarMenuToggle = dynamic(() => import('@nextui-org/react').then(mod => ({ default: mod.NavbarMenuToggle })), {
  ssr: false,
  loading: () => <button className="p-2 animate-pulse" />
});

const NavbarMenu = dynamic(() => import('@nextui-org/react').then(mod => ({ default: mod.NavbarMenu })), {
  ssr: false,
  loading: () => <div className="absolute top-full left-0 w-full bg-white shadow-lg animate-pulse" />
});

const NavbarMenuItem = dynamic(() => import('@nextui-org/react').then(mod => ({ default: mod.NavbarMenuItem })), {
  ssr: false,
  loading: () => <div className="p-2 animate-pulse" />
});

const Dropdown = dynamic(() => import('@nextui-org/react').then(mod => ({ default: mod.Dropdown })), {
  ssr: false,
  loading: () => <div className="relative animate-pulse" />
});

const DropdownTrigger = dynamic(() => import('@nextui-org/react').then(mod => ({ default: mod.DropdownTrigger })), {
  ssr: false,
  loading: () => <div className="animate-pulse" />
});

const DropdownMenu = dynamic(() => import('@nextui-org/react').then(mod => ({ default: mod.DropdownMenu })), {
  ssr: false,
  loading: () => <div className="absolute bg-white shadow-lg rounded-lg animate-pulse" />
});

const DropdownItem = dynamic(() => import('@nextui-org/react').then(mod => ({ default: mod.DropdownItem })), {
  ssr: false,
  loading: () => <div className="p-2 hover:bg-gray-100 animate-pulse" />
});

// Export des composants optimisés
export {
  Button as LazyButton,
  Card as LazyCard,
  CardBody as LazyCardBody,
  CardHeader as LazyCardHeader,
  Input as LazyInput,
  Modal as LazyModal,
  ModalContent as LazyModalContent,
  ModalHeader as LazyModalHeader,
  ModalBody as LazyModalBody,
  ModalFooter as LazyModalFooter,
  Spinner as LazySpinner,
  Progress as LazyProgress,
  Table as LazyTable,
  TableHeader as LazyTableHeader,
  TableBody as LazyTableBody,
  TableRow as LazyTableRow,
  TableCell as LazyTableCell,
  TableColumn as LazyTableColumn,
  Navbar as LazyNavbar,
  NavbarBrand as LazyNavbarBrand,
  NavbarContent as LazyNavbarContent,
  NavbarItem as LazyNavbarItem,
  NavbarMenuToggle as LazyNavbarMenuToggle,
  NavbarMenu as LazyNavbarMenu,
  NavbarMenuItem as LazyNavbarMenuItem,
  Dropdown as LazyDropdown,
  DropdownTrigger as LazyDropdownTrigger,
  DropdownMenu as LazyDropdownMenu,
  DropdownItem as LazyDropdownItem,
};

// Composant wrapper pour faciliter l'utilisation
interface LazyNextUIProviderProps {
  children: React.ReactNode;
}

export const LazyNextUIProvider: React.FC<LazyNextUIProviderProps> = ({ children }) => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}>
      {children}
    </Suspense>
  );
};