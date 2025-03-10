<?php

namespace App\Http\Controllers;

use App\Models\Experience;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;
use IntlChar;

class ExperienceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $experiences = Experience::all();
        return Inertia::render('Experience/Index', ['experiences' => $experiences]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $request->validate([
            'name' => 'required|string|max:255',
            'enterprise' => 'required|string|max:255',
            'description' => 'required|string',
            'url' => 'required|string',
            'start_date' => 'required|string',
            'end_date' => 'required|string',
            'technologies' => 'required|array',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $path = null;

        if ($request->hasFile('image')) {
            $image = $request->file('image');

            $imageName = Str::random(20) . '.' . $image->getClientOriginalExtension();
    
            $path = $image->storeAs('/images', $imageName);
        }

        Experience::create([
            'name' => $request->name,
            'enterprise' => $request->enterprise,
            'description' => $request->description,
            'url' => $request->url,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'technologies' => $request->technologies,
            'image' => $path,
        ]);

        dd(redirect()->route('experiencias.index'));

        return ;
    }

    /**
     * Display the specified resource.
     */
    public function show(Experience $experience)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Experience $experience)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {

        $experience = Experience::find($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'enterprise' => 'required|string|max:255',
            'description' => 'required|string',
            'url' => 'required|string',
            'start_date' => 'required|string',
            'end_date' => 'required|string',
            'technologies' => 'required|array',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);   
        $path = null;
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = Str::random(20) . '.' . $image->getClientOriginalExtension();
            $path = $image->storeAs('/images', $imageName);
            
            if ($experience->image) {
                Storage::delete($experience->image);
            }
            
        } else {
            $path = $experience->image;
        }
        
        $update = $experience->update([
            'name' => $request->name,
            'enterprise' => $request->enterprise,
            'description' => $request->description,
            'url' => $request->url,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'technologies' => $request->technologies,
            'image' => $path,
        ]);


        return Inertia::location(route('experiencias.index'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Experience $experience)
    {
        //
    }
}
