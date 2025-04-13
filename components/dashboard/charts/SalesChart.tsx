"use client";

import React, { useEffect, useState, useRef } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    BarController,
    LineController
} from "chart.js";
import { Chart } from "chart.js";
import { useRouter } from "next/navigation";
import { fetchInsights } from "../../../lib/fetchInsights";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    BarController,  // Add this
    LineController, // Add this
    Title,
    Tooltip,
    Legend,
    Filler
);

interface Sale {
    date: string;
    total: number;
    status: string;
}

interface SalesData {
    labels: string[];
    datasets: {
        type: 'bar' | 'line';
        label: string;
        data: number[];
        backgroundColor?: string | string[];
        borderColor: string | string[];
        borderWidth: number;
        fill?: boolean | string;
        tension?: number;
        yAxisID?: string;
        pointRadius?: number;
    }[];
}

const cn = (...classes: string[]): string => {
    return classes.filter(Boolean).join(' ');
};

const SalesChart = ({ className = "" }) => {
    const router = useRouter();
    const [salesData, setSalesData] = useState<SalesData>({
        labels: [],
        datasets: [],
    });
    const [fetchedData, setFetchedData] = useState<{ sales: Sale[] } | null>(null);
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart | null>(null);
    const [chartInitialized, setChartInitialized] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const insights = await fetchInsights();
                if (!insights || !insights.sales) {
                    console.error("No sales data in insights:", insights);
                    return;
                }
                setFetchedData(insights);
            } catch (error) {
                console.error("Error fetching sales data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!fetchedData?.sales) return;

        const labels = fetchedData.sales.map((sale: Sale) => {
            const date = new Date(sale.date);
            return isNaN(date.getTime()) 
                ? "Invalid Date" 
                : date.toLocaleDateString("en-US", { month: 'short', year: 'numeric' });
        });

        const totalSales = fetchedData.sales.map((sale: Sale) => Number(sale.total) || 0);
        const completedSales = fetchedData.sales.map((sale: Sale) => 
            sale.status === 'completed' ? Number(sale.total) : 0
        );
        const completionRate = totalSales.map((total: number, index: number) => 
            total > 0 ? (completedSales[index] / total) * 100 : 0
        );

        setSalesData({
            labels,
            datasets: [
                {
                    type: "bar",
                    label: "Total Sales (KSh)",
                    data: totalSales,
                    backgroundColor: 'rgba(96, 165, 250, 0.7)',
                    borderColor: '#60a5fa',
                    borderWidth: 1,
                    yAxisID: 'y-left'
                },
                {
                    type: "bar",
                    label: "Completed Sales (KSh)",
                    data: completedSales,
                    backgroundColor: 'rgba(16, 185, 129, 0.7)',
                    borderColor: '#10b981',
                    borderWidth: 1,
                    yAxisID: 'y-left'
                },
                {
                    type: "line",
                    label: "Completion Rate (%)",
                    data: completionRate,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    yAxisID: 'y-right',
                    pointRadius: 4
                }
            ],
        });
    }, [fetchedData]);

    useEffect(() => {
        const chartCtx = chartRef.current;
        if (!chartCtx || !salesData.labels.length) return;

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        try {
            chartInstance.current = new Chart(chartCtx, {
                type: 'bar',
                data: salesData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Sales History',
                            color: '#fff',
                            font: {
                                size: 16,
                                weight: 'bold'
                            },
                            padding: 20
                        },
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#fff',
                                padding: 20,
                                usePointStyle: true,
                                font: {
                                    size: 12
                                }
                            },
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: '#4a5568',
                            borderWidth: 1,
                            displayColors: true,
                            callbacks: {
                                label: (context) => {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        const value = context.parsed.y;
                                        label += context.dataset.label?.includes('%')
                                            ? `${value.toFixed(1)}%`
                                            : `KSh ${value.toLocaleString()}`;
                                    }
                                    return label;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: '#fff',
                                font: {
                                    size: 12
                                },
                                maxRotation: 45,
                                minRotation: 45
                            },
                            grid: {
                                display: false
                            }
                        },
                        'y-left': {
                            position: 'left',
                            beginAtZero: true,
                            ticks: {
                                color: '#fff',
                                callback: (value) =>
                                    typeof value === 'number'
                                        ? `KSh ${value.toLocaleString()}`
                                        : '',
                                font: {
                                    size: 12
                                }
                            },
                            grid: {
                                color: 'rgba(255,255,255,0.1)'
                            }
                        },
                        'y-right': {
                            position: 'right',
                            beginAtZero: true,
                            ticks: {
                                color: '#fff',
                                callback: (value) =>
                                    typeof value === 'number' ? value.toFixed(0) + '%' : '',
                                font: {
                                    size: 12
                                }
                            },
                            grid: {
                                display: false
                            }
                        }
                    },
                },
            });
            setChartInitialized(true);
        } catch (error) {
            console.error("Chart initialization error:", error);
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }
        };
    }, [salesData]);

    return (
        <div className={cn(
            "bg-gray-800 p-6 rounded-lg shadow-md", 
            "hover:opacity-80 transition-opacity",
            className
        )}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-xl font-semibold mb-3">Sales History</h2>
            </div>
            <div className="h-[300px] w-full relative"> 
                <canvas ref={chartRef} className="w-full h-full" />
                {salesData.labels.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-gray-400 text-sm">Loading...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesChart;

