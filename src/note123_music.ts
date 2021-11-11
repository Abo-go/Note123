module Note123{

enum ChromaType {
    Sharp,
    Natural,
    Flat,
}

enum NoteType {
    PlaceHolder = 8,
    Beat,
    Dot,
}

// 唱名
enum Syllable {
    Do = 1,
    Re,
    Mi,
    Fa,
    Sol,
    La,
    Ti,
}

// 音名
enum NoteName {
    C = 1,
    D,
    E,
    F,
    G,
    A,
    B
}

enum Information {
    K,  //Key
    T,  //Tempo
}

enum BeatType {
    Whole = 1,
    Half = 2,
    Quarter = 4,
    Eighth = 8,
}

class Tempo {
    speed: number;
    beats: number;
    beatType: BeatType;
}

class SimpleNote {
    readonly note: number;
    readonly chromatic: ChromaType;
    readonly octave:number;
}

abstract class Renderable {
    x : number;
    y : number;
    move(x: number, y: number){
        this.x = x;
        this.y = y;
    }
    abstract render(): void;
}

class Note extends Renderable {
    readonly note: number;
    readonly chromatic: ChromaType;
    readonly octave:number;

    parent: Note = null;
    children: Note[] = [];

    constructor(parent: Note, note: number, octave: number = 0, chroma: ChromaType = ChromaType.Natural){
        super();
        this.parent = parent;
        this.note = note;
        this.octave = octave;
        this.chromatic = chroma;

        if(parent != null){
            parent.appendChild(this);
        }
    }

    get noteName(){
        if(this.note == NoteType.PlaceHolder){
            return '-';
        }
        else{
            return this.note.toString();
        }
    }

    get minWidth(){
        let minWidth = 0
        if(this.note != NoteType.Beat){
            minWidth += gFontWidth;
        }

        for(let note of this.children){
            minWidth += note.minWidth;
        }

        return minWidth;
    }

    get depth(){
        let depth = 1;
        if(this.parent != null)
        {
            depth += this.parent.depth;
        }
        return depth;
    }

    appendChild(child: Note){
        child.parent = this;
        this.children.push(child);
    }

    override render(){
        if(this.note == NoteType.Beat){
            // 绘制
            createLine(this.x, this.y + this.depth * gUnderLineSpace, this.minWidth, 0);
            for(let child of this.children){
                child.render();
            }
        }
        else{
            createSvgText(this.noteName, this.x, this.y);
            let cx = this.x, cy = this.y;
            for(let i = 0; i < Math.abs(this.octave); i++){
                if(this.octave > 0){
                    cy = this.y + gFontSize / 2 + i * 5;
                }
                else{
                    cy = this.y - gFontSize / 2 + i * 5;
                }
        
                let circle = createSvgNode(parent, 'circle');
                circle.setAttribute('cx', cx);
                circle.setAttribute('cy', cy);
                circle.setAttribute('r', 3);
            }
        }
    }

    override move(x: number, y:number)
    {
        super.move(x, y);
        for(let child of this.children)
        {
            child.move(x, y);
            x += child.minWidth;
        }
    }
}

export class Music{
    notes: Note[] = [];
    key: SimpleNote;

    render(txt: string){
        console.info("render start");

        console.info(NoteName["A"], NoteName[1]);

        g1.textContent = '';
        let parentNote: Note = null;

        let lines = txt.split('\n');

        for(let line of lines)
        {
            if(line.charAt(1) == ':')
            {
                let info = Information[line.charAt(0)];
                switch(info)
                {
                    case Information.K:

                        break;
                    case Information.T:

                        break;
                    default:
                        break;
                }
            }
        }

        for(let i = 0; i < txt.length; i++){
            let s = txt.charAt(i);
            let newNote: Note = null;
            if(s == '('){
                let tmpNote = new Note(parentNote, NoteType.Beat);
                if(parentNote == null){
                    this.notes.push(tmpNote);
                }
                parentNote = tmpNote;
            }
            else if(s == ')'){
                parentNote = parentNote.parent;
            }
            else if(s == '-'){
                newNote = new Note(parentNote, NoteType.PlaceHolder);
            }
            else{
                let n: number = parseInt(s);
                if(n >= 0 && n < 8){
                    // chrom
                    let idx = i - 1;
                    let chrom = ChromaType.Natural;
                    if(txt.charAt(idx) == 'b'){
                        chrom = ChromaType.Flat;
                    }
                    else if(txt.charAt(idx) == '#'){
                        chrom = ChromaType.Sharp;
                    }
    
                    // octave
                    let octave = 0;
                    idx = i;
                    while(txt.charAt(++idx) == '\''){
                        octave++;
                    }
                    idx = i;
                    while(txt.charAt(++idx)=='\,'){
                        octave--;
                    }
                    
                    newNote = new Note(parentNote, n, octave, chrom);
                }
            }

            if(newNote != null && parentNote == null){
                this.notes.push(newNote);
            }
        }

        
        // 乐谱渲染
        let startX = gFontWidth;
        let startY = gFontSize;
        for(let note of this.notes){
            note.move(startX, startY);
            startX += note.minWidth;
            note.render();
            console.info("note minwidth:%d", note.minWidth);
        }

        console.info("render end");
    }
}

}